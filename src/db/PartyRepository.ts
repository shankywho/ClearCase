import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';
import { docClient, getTableName } from './client';
import { AddPartyDTO, PartyItem, VerifyConsentDTO } from '../types';

export class PartyRepository {
  private customTableName?: string;

  constructor(tableName?: string) {
    this.customTableName = tableName;
  }

  private get tableName(): string {
    return this.customTableName || getTableName();
  }

  /**
   * Add a party to a dispute case with OTP and TTL expiration
   * Pattern: PutItem into ClearCaseTable
   * PK: CASE#<caseId>
   * SK: PARTY#<phone>
   * TTL Attribute: otpExpiry (Epoch seconds)
   */
  async addParty(caseId: string, dto: AddPartyDTO): Promise<PartyItem> {
    const cleanCaseId = caseId.replace(/^CASE#/, '');
    const cleanPhone = dto.phone.replace(/[^0-9+]/g, '');
    const nowIso = new Date().toISOString();

    // Generate 6-digit OTP if not provided
    const otp = dto.otp || Math.floor(100000 + Math.random() * 900000).toString();

    // Default TTL: 15 minutes (900 seconds) from now
    const ttlSeconds = dto.otpExpirySeconds || 900;
    const otpExpiryEpoch = Math.floor(Date.now() / 1000) + ttlSeconds;

    const partyItem: PartyItem = {
      PK: `CASE#${cleanCaseId}`,
      SK: `PARTY#${cleanPhone}`,
      GSI2PK: `PHONE#${cleanPhone}`,
      caseId: cleanCaseId,
      phone: cleanPhone,
      name: dto.name,
      role: dto.role,
      otp,
      otpExpiry: otpExpiryEpoch,
      consentStatus: 'PENDING',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    console.log(
      `[DynamoDB PartyRepository] Registering party: ${dto.name} (${cleanPhone}) as ${dto.role} for Case: ${cleanCaseId}`
    );
    console.log(
      `[DynamoDB PartyRepository] Generated OTP: ${otp}, TTL Expiry (epoch): ${otpExpiryEpoch}`
    );

    await docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: partyItem,
      })
    );

    console.log(
      `[DynamoDB PartyRepository] Successfully added party ${cleanPhone} to case ${cleanCaseId}`
    );
    return partyItem;
  }

  /**
   * Get a specific party by case ID and phone
   * Pattern: GetItem with PK: CASE#<caseId>, SK: PARTY#<phone>
   */
  async getParty(caseId: string, phone: string): Promise<PartyItem | null> {
    const cleanCaseId = caseId.replace(/^CASE#/, '');
    const cleanPhone = phone.replace(/[^0-9+]/g, '');

    console.log(
      `[DynamoDB PartyRepository] Fetching party record for Case: ${cleanCaseId}, Phone: ${cleanPhone}`
    );

    const response = await docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `CASE#${cleanCaseId}`,
          SK: `PARTY#${cleanPhone}`,
        },
      })
    );

    if (!response.Item) {
      console.log(`[DynamoDB PartyRepository] Party not found: ${cleanPhone} in Case: ${cleanCaseId}`);
      return null;
    }

    return response.Item as PartyItem;
  }

  /**
   * Get all parties associated with a specific case
   * Pattern: Query with PK: CASE#<caseId> AND SK begins_with('PARTY#')
   */
  async getPartiesForCase(caseId: string): Promise<PartyItem[]> {
    const cleanCaseId = caseId.replace(/^CASE#/, '');
    console.log(`[DynamoDB PartyRepository] Querying all parties for Case: ${cleanCaseId}`);

    const response = await docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `CASE#${cleanCaseId}`,
          ':skPrefix': 'PARTY#',
        },
      })
    );

    const parties = (response.Items || []) as PartyItem[];
    console.log(
      `[DynamoDB PartyRepository] Found ${parties.length} parties for Case: ${cleanCaseId}`
    );
    return parties;
  }

  /**
   * Get all party records in which a phone number participates across cases.
   * Pattern: Query on PartyPhoneIndex (GSI2) with GSI2PK = PHONE#<phone>
   * Enables the "My Cases" dashboard for a disputant.
   */
  async getPartiesForPhone(phone: string): Promise<PartyItem[]> {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    console.log(`[DynamoDB PartyRepository] Querying PartyPhoneIndex for phone: ${cleanPhone}`);

    const response = await docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'PartyPhoneIndex',
        KeyConditionExpression: 'GSI2PK = :gsi2pk',
        ExpressionAttributeValues: {
          ':gsi2pk': `PHONE#${cleanPhone}`,
        },
      })
    );

    const parties = (response.Items || []) as PartyItem[];
    console.log(
      `[DynamoDB PartyRepository] Found ${parties.length} party record(s) for phone: ${cleanPhone}`
    );
    return parties;
  }

  /**
   * Verify party OTP and atomically record e-consent
   * Pattern: UpdateItem with ConditionExpression verifying OTP match and TTL non-expiry
   */
  async verifyPartyOtpAndConsent(
    caseId: string,
    dto: VerifyConsentDTO
  ): Promise<PartyItem> {
    const cleanCaseId = caseId.replace(/^CASE#/, '');
    const cleanPhone = dto.phone.replace(/[^0-9+]/g, '');
    const nowIso = new Date().toISOString();
    const currentEpoch = Math.floor(Date.now() / 1000);

    console.log(
      `[DynamoDB PartyRepository] Verifying OTP consent for Phone: ${cleanPhone} in Case: ${cleanCaseId}`
    );

    try {
      const response = await docClient.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: {
            PK: `CASE#${cleanCaseId}`,
            SK: `PARTY#${cleanPhone}`,
          },
          UpdateExpression:
            'SET #consentStatus = :accepted, #consentTimestamp = :nowIso, #updatedAt = :nowIso REMOVE #otp',
          ConditionExpression:
            'attribute_exists(PK) AND #otp = :inputOtp AND (attribute_not_exists(#otpExpiry) OR #otpExpiry >= :currentEpoch)',
          ExpressionAttributeNames: {
            '#consentStatus': 'consentStatus',
            '#consentTimestamp': 'consentTimestamp',
            '#updatedAt': 'updatedAt',
            '#otp': 'otp',
            '#otpExpiry': 'otpExpiry',
          },
          ExpressionAttributeValues: {
            ':accepted': 'ACCEPTED',
            ':inputOtp': dto.otp.trim(),
            ':nowIso': nowIso,
            ':currentEpoch': currentEpoch,
          },
          ReturnValues: 'ALL_NEW',
        })
      );

      console.log(
        `[DynamoDB PartyRepository] OTP verified successfully. Consent ACCEPTED for ${cleanPhone}`
      );
      return response.Attributes as PartyItem;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        console.error(
          `[DynamoDB PartyRepository] Consent verification failed for ${cleanPhone}: Invalid or expired OTP.`
        );
        throw new Error('INVALID_OR_EXPIRED_OTP: The provided OTP does not match or has expired.');
      }
      console.error(`[DynamoDB PartyRepository] Update error during consent verification:`, error);
      throw error;
    }
  }

  /**
   * Reset consent status to PENDING and generate fresh OTPs for all parties in a case.
   * Triggered when a human mediator modifies or overrides the draft.
   */
  async resetPartiesConsent(caseId: string): Promise<PartyItem[]> {
    const cleanCaseId = caseId.replace(/^CASE#/, '');
    console.log(`[DynamoDB PartyRepository] Resetting consent and regenerating OTPs for Case: ${cleanCaseId}`);

    const existingParties = await this.getPartiesForCase(cleanCaseId);
    const updatedParties: PartyItem[] = [];
    const nowIso = new Date().toISOString();
    const expiryEpoch = Math.floor(Date.now() / 1000) + 900; // 15 mins

    for (const party of existingParties) {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

      const response = await docClient.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: {
            PK: `CASE#${cleanCaseId}`,
            SK: party.SK,
          },
          UpdateExpression:
            'SET #consentStatus = :pending, #otp = :newOtp, #otpExpiry = :expiry, #updatedAt = :nowIso REMOVE #consentTimestamp',
          ExpressionAttributeNames: {
            '#consentStatus': 'consentStatus',
            '#otp': 'otp',
            '#otpExpiry': 'otpExpiry',
            '#updatedAt': 'updatedAt',
            '#consentTimestamp': 'consentTimestamp',
          },
          ExpressionAttributeValues: {
            ':pending': 'PENDING',
            ':newOtp': newOtp,
            ':expiry': expiryEpoch,
            ':nowIso': nowIso,
          },
          ReturnValues: 'ALL_NEW',
        })
      );

      console.log(
        `[DynamoDB PartyRepository] Reset consent for party ${party.phone}: New OTP=${newOtp}, Expiry=${expiryEpoch}`
      );
      updatedParties.push(response.Attributes as PartyItem);
    }

    return updatedParties;
  }
}

