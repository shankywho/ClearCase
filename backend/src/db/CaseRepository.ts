import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';
import { docClient, getTableName } from './client';
import {
  CaseAggregate,
  CaseMetadataItem,
  CaseStatus,
  CreateCaseDTO,
  PartyItem,
  UpdateCaseStatusDTO,
} from '../types';

export class CaseRepository {
  private customTableName?: string;

  constructor(tableName?: string) {
    this.customTableName = tableName;
  }

  private get tableName(): string {
    return this.customTableName || getTableName();
  }

  /**
   * Create a new dispute case in DynamoDB
   * Pattern: PutItem into ClearCaseTable
   * PK: CASE#<id>
   * SK: METADATA
   * GSI1PK: JURISDICTION#<district>
   * GSI1SK: STATUS#<status>
   */
  async createCase(dto: CreateCaseDTO): Promise<CaseMetadataItem> {
    const caseId = dto.id || crypto.randomUUID();
    const now = new Date().toISOString();
    const initialStatus: CaseStatus = 'INTAKE_PENDING';

    const caseItem: CaseMetadataItem = {
      PK: `CASE#${caseId}`,
      SK: 'METADATA',
      GSI1PK: `JURISDICTION#${dto.district.trim()}`,
      GSI1SK: `STATUS#${initialStatus}`,
      id: caseId,
      title: dto.title,
      description: dto.description,
      originalAudioUrl: dto.originalAudioUrl,
      transcribedText: dto.transcribedText,
      englishTranslation: dto.englishTranslation,
      dialect: dto.dialect || 'hindi',
      state: dto.state,
      district: dto.district,
      village: dto.village,
      status: initialStatus,
      createdAt: now,
      updatedAt: now,
    };

    console.log(`[DynamoDB CaseRepository] Creating case ID: ${caseId} in district: ${dto.district}`);

    await docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: caseItem,
        ConditionExpression: 'attribute_not_exists(PK)',
      })
    );

    console.log(`[DynamoDB CaseRepository] Successfully created case: ${caseId}`);
    return caseItem;
  }

  /**
   * Get case metadata by ID
   * Pattern: GetItem with PK: CASE#<id>, SK: METADATA
   */
  async getCaseById(caseId: string): Promise<CaseMetadataItem | null> {
    const cleanId = caseId.replace(/^CASE#/, '');
    console.log(`[DynamoDB CaseRepository] Fetching case metadata for ID: ${cleanId}`);

    const response = await docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `CASE#${cleanId}`,
          SK: 'METADATA',
        },
      })
    );

    if (!response.Item) {
      console.log(`[DynamoDB CaseRepository] Case not found: ${cleanId}`);
      return null;
    }

    console.log(`[DynamoDB CaseRepository] Case metadata retrieved: ${cleanId} (Status: ${response.Item.status})`);
    return response.Item as CaseMetadataItem;
  }

  /**
   * Get case and all associated parties in a single query
   * Pattern: Query on PK: CASE#<id>
   * Returns METADATA + all PARTY# items in one network round trip
   */
  async getCaseWithParties(caseId: string): Promise<CaseAggregate | null> {
    const cleanId = caseId.replace(/^CASE#/, '');
    console.log(`[DynamoDB CaseRepository] Single-table query for full case aggregate: ${cleanId}`);

    const response = await docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `CASE#${cleanId}`,
        },
      })
    );

    if (!response.Items || response.Items.length === 0) {
      console.log(`[DynamoDB CaseRepository] No items found for case: ${cleanId}`);
      return null;
    }

    let metadata: CaseMetadataItem | null = null;
    const parties: PartyItem[] = [];

    for (const item of response.Items) {
      if (item.SK === 'METADATA') {
        metadata = item as CaseMetadataItem;
      } else if (item.SK.startsWith('PARTY#')) {
        parties.push(item as PartyItem);
      }
    }

    if (!metadata) {
      console.log(`[DynamoDB CaseRepository] Corrupted record: No METADATA found for case: ${cleanId}`);
      return null;
    }

    console.log(
      `[DynamoDB CaseRepository] Case aggregate retrieved for ${cleanId}: metadata + ${parties.length} party/parties`
    );

    return {
      metadata,
      parties,
    };
  }

  /**
   * Update case status safely, re-indexing GSI1SK
   * Pattern: UpdateItem on PK: CASE#<id>, SK: METADATA
   * Also updates GSI1SK = STATUS#<newStatus> for MediatorQueueIndex
   */
  async updateCaseStatus(caseId: string, dto: UpdateCaseStatusDTO): Promise<CaseMetadataItem> {
    const cleanId = caseId.replace(/^CASE#/, '');
    const now = new Date().toISOString();

    console.log(
      `[DynamoDB CaseRepository] Updating case status for ID: ${cleanId} to: ${dto.status}`
    );

    const updateExpressions: string[] = [
      '#status = :status',
      '#gsi1sk = :gsi1sk',
      '#updatedAt = :updatedAt',
    ];

    const expressionAttributeNames: Record<string, string> = {
      '#status': 'status',
      '#gsi1sk': 'GSI1SK',
      '#updatedAt': 'updatedAt',
    };

    const expressionAttributeValues: Record<string, any> = {
      ':status': dto.status,
      ':gsi1sk': `STATUS#${dto.status}`,
      ':updatedAt': now,
    };

    if (dto.confidenceScore !== undefined) {
      updateExpressions.push('#confidenceScore = :confidenceScore');
      expressionAttributeNames['#confidenceScore'] = 'confidenceScore';
      expressionAttributeValues[':confidenceScore'] = dto.confidenceScore;
    }

    if (dto.escalationReason !== undefined) {
      updateExpressions.push('#escalationReason = :escalationReason');
      expressionAttributeNames['#escalationReason'] = 'escalationReason';
      expressionAttributeValues[':escalationReason'] = dto.escalationReason;
    }

    if (dto.statutoryReferences !== undefined) {
      updateExpressions.push('#statutoryReferences = :statutoryReferences');
      expressionAttributeNames['#statutoryReferences'] = 'statutoryReferences';
      expressionAttributeValues[':statutoryReferences'] = dto.statutoryReferences;
    }

    if (dto.settlementDraft !== undefined) {
      updateExpressions.push('#settlementDraft = :settlementDraft');
      expressionAttributeNames['#settlementDraft'] = 'settlementDraft';
      expressionAttributeValues[':settlementDraft'] = dto.settlementDraft;
    }

    if (dto.settlementAudioUrl !== undefined) {
      updateExpressions.push('#settlementAudioUrl = :settlementAudioUrl');
      expressionAttributeNames['#settlementAudioUrl'] = 'settlementAudioUrl';
      expressionAttributeValues[':settlementAudioUrl'] = dto.settlementAudioUrl;
    }

    if (dto.onChainTxHash !== undefined) {
      updateExpressions.push('#onChainTxHash = :onChainTxHash');
      expressionAttributeNames['#onChainTxHash'] = 'onChainTxHash';
      expressionAttributeValues[':onChainTxHash'] = dto.onChainTxHash;
    }

    if (dto.transcribedText !== undefined) {
      updateExpressions.push('#transcribedText = :transcribedText');
      expressionAttributeNames['#transcribedText'] = 'transcribedText';
      expressionAttributeValues[':transcribedText'] = dto.transcribedText;
    }

    if (dto.englishTranslation !== undefined) {
      updateExpressions.push('#englishTranslation = :englishTranslation');
      expressionAttributeNames['#englishTranslation'] = 'englishTranslation';
      expressionAttributeValues[':englishTranslation'] = dto.englishTranslation;
    }

    const response = await docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: {
          PK: `CASE#${cleanId}`,
          SK: 'METADATA',
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ConditionExpression: 'attribute_exists(PK)',
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    console.log(`[DynamoDB CaseRepository] Status successfully updated for case ${cleanId} to ${dto.status}`);
    return response.Attributes as CaseMetadataItem;
  }

  /**
   * Update case audio references (grievance recording or settlement TTS)
   * without altering case status.
   * Pattern: UpdateItem on PK: CASE#<id>, SK: METADATA
   */
  async updateCaseAudio(
    caseId: string,
    audio: { originalAudioUrl?: string; settlementAudioUrl?: string }
  ): Promise<CaseMetadataItem> {
    const cleanId = caseId.replace(/^CASE#/, '');
    const now = new Date().toISOString();

    console.log(`[DynamoDB CaseRepository] Updating audio references for ID: ${cleanId}`);

    const updateExpressions: string[] = ['#updatedAt = :updatedAt'];
    const expressionAttributeNames: Record<string, string> = {
      '#updatedAt': 'updatedAt',
    };
    const expressionAttributeValues: Record<string, any> = {
      ':updatedAt': now,
    };

    if (audio.originalAudioUrl !== undefined) {
      updateExpressions.push('#originalAudioUrl = :originalAudioUrl');
      expressionAttributeNames['#originalAudioUrl'] = 'originalAudioUrl';
      expressionAttributeValues[':originalAudioUrl'] = audio.originalAudioUrl;
    }

    if (audio.settlementAudioUrl !== undefined) {
      updateExpressions.push('#settlementAudioUrl = :settlementAudioUrl');
      expressionAttributeNames['#settlementAudioUrl'] = 'settlementAudioUrl';
      expressionAttributeValues[':settlementAudioUrl'] = audio.settlementAudioUrl;
    }

    const response = await docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: {
          PK: `CASE#${cleanId}`,
          SK: 'METADATA',
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ConditionExpression: 'attribute_exists(PK)',
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    console.log(`[DynamoDB CaseRepository] Audio references updated for case ${cleanId}`);
    return response.Attributes as CaseMetadataItem;
  }

  /**
   * Query the Mediator Queue via Global Secondary Index (GSI1)
   * Pattern: Query on MediatorQueueIndex
   * GSI1PK: JURISDICTION#<district>
   * GSI1SK: STATUS#<status> (e.g. STATUS#MEDIATOR_REVIEW_REQUIRED)
   */
  async queryMediatorQueue(district: string, status?: CaseStatus): Promise<CaseMetadataItem[]> {
    const cleanDistrict = district.trim();
    console.log(
      `[DynamoDB CaseRepository] Querying MediatorQueueIndex for District: ${cleanDistrict}, Status: ${status || 'ALL'}`
    );

    let keyCondition = 'GSI1PK = :gsi1pk';
    const expressionValues: Record<string, any> = {
      ':gsi1pk': `JURISDICTION#${cleanDistrict}`,
    };

    if (status) {
      keyCondition += ' AND GSI1SK = :gsi1sk';
      expressionValues[':gsi1sk'] = `STATUS#${status}`;
    } else {
      keyCondition += ' AND begins_with(GSI1SK, :statusPrefix)';
      expressionValues[':statusPrefix'] = 'STATUS#';
    }

    const response = await docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'MediatorQueueIndex',
        KeyConditionExpression: keyCondition,
        ExpressionAttributeValues: expressionValues,
      })
    );

    const results = (response.Items || []) as CaseMetadataItem[];
    console.log(
      `[DynamoDB CaseRepository] MediatorQueueIndex returned ${results.length} disputes for district: ${cleanDistrict}`
    );

    return results;
  }
}
