import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, getTableName } from './client';
import { AuditEventType, AuditLogItem } from '../types';

export class AuditRepository {
  private customTableName?: string;

  constructor(tableName?: string) {
    this.customTableName = tableName;
  }

  private get tableName(): string {
    return this.customTableName || getTableName();
  }

  /**
   * Append an immutable audit event to the case history.
   * Pattern: PutItem
   * PK: CASE#<caseId>
   * SK: AUDIT#<isoTimestamp>#<action>
   */
  async recordEvent(
    caseId: string,
    action: AuditEventType,
    actor: string,
    details: Record<string, any> = {}
  ): Promise<AuditLogItem> {
    const cleanCaseId = caseId.replace(/^CASE#/, '');
    const nowIso = new Date().toISOString();

    const auditItem: AuditLogItem = {
      PK: `CASE#${cleanCaseId}`,
      SK: `AUDIT#${nowIso}#${action}`,
      caseId: cleanCaseId,
      action,
      actor,
      details,
      timestamp: nowIso,
    };

    console.log(
      `[Audit Trail] Recording Event: [${action}] for Case: ${cleanCaseId} by Actor: "${actor}"`
    );

    await docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: auditItem,
      })
    );

    console.log(`[Audit Trail] Event successfully recorded: ${auditItem.SK}`);
    return auditItem;
  }

  /**
   * Retrieve the complete chronological audit trail for a case.
   * Pattern: Query with PK = CASE#<caseId> AND SK begins_with('AUDIT#')
   */
  async getAuditTrail(caseId: string): Promise<AuditLogItem[]> {
    const cleanCaseId = caseId.replace(/^CASE#/, '');
    console.log(`[Audit Trail] Fetching audit trail for Case: ${cleanCaseId}`);

    const response = await docClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
        ExpressionAttributeValues: {
          ':pk': `CASE#${cleanCaseId}`,
          ':skPrefix': 'AUDIT#',
        },
        ScanIndexForward: true, // Chronological ordering
      })
    );

    const logs = (response.Items || []) as AuditLogItem[];
    console.log(
      `[Audit Trail] Retrieved ${logs.length} audit event(s) for Case: ${cleanCaseId}`
    );
    return logs;
  }
}
