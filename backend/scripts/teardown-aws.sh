#!/usr/bin/env bash
set -e

# ==============================================================================
# ClearCase: AWS Services Teardown & Decommissioning Script
# ==============================================================================

REGION="us-east-1"
ACCOUNT_ID="517025126295"
BUCKET_NAME="clearcase-audio-517025126295-us-east-1"
TABLE_NAME="ClearCaseTable-Prod"
ALARM_NAME="ClearCase-Dispute-Escalation-Alarm"
TOPIC_ARN="arn:aws:sns:us-east-1:${ACCOUNT_ID}:ClearCase-Dispute-Alerts"
BUDGET_NAME="ClearCase-10-USD-Limit"
IAM_USER="clearcase-dev"
ACCESS_KEY_ID="AKIAXQYIZK6LZHG7DI34"

echo "================================================================"
echo "  PROJECT CLEARCASE: AWS TEARDOWN & RESOURCE CLEANUP SCRIPT      "
echo "================================================================"
echo "Region: $REGION"
echo "Account ID: $ACCOUNT_ID"
echo ""

read -p "⚠️  Are you sure you want to permanently delete all ClearCase AWS resources? (y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Teardown aborted."
  exit 0
fi

echo ""

# 1. Empty and Delete Amazon S3 Audio Storage Bucket
echo "[1/7] Deleting S3 audio bucket: $BUCKET_NAME..."
aws s3 rm "s3://${BUCKET_NAME}" --recursive --region "$REGION" 2>/dev/null || true
aws s3api delete-bucket --bucket "$BUCKET_NAME" --region "$REGION" 2>/dev/null || echo "  -> S3 bucket already deleted or not found."

# 2. Delete Amazon DynamoDB Primary Table
echo "[2/7] Deleting DynamoDB table: $TABLE_NAME..."
aws dynamodb delete-table --table-name "$TABLE_NAME" --region "$REGION" 2>/dev/null || echo "  -> DynamoDB table already deleted or not found."

# 3. Delete CloudWatch Alarm
echo "[3/7] Deleting CloudWatch alarm: $ALARM_NAME..."
aws cloudwatch delete-alarms --alarm-names "$ALARM_NAME" --region "$REGION" 2>/dev/null || echo "  -> CloudWatch alarm already deleted."

# 4. Delete Amazon SNS Topic
echo "[4/7] Deleting SNS alert topic: $TOPIC_ARN..."
aws sns delete-topic --topic-arn "$TOPIC_ARN" --region "$REGION" 2>/dev/null || echo "  -> SNS topic already deleted."

# 5. Delete Systems Manager Parameter Store Keys
echo "[5/7] Deleting SSM Parameter Store keys under /clearcase/..."
aws ssm delete-parameters --names \
  "/clearcase/env" \
  "/clearcase/dynamodb/table" \
  "/clearcase/s3/audio_bucket" \
  "/clearcase/sns/topic_arn" \
  "/clearcase/ai/provider" \
  "/clearcase/policies/cedar" \
  --region "$REGION" 2>/dev/null || echo "  -> SSM parameters already deleted."

# 6. Delete AWS Budget
echo "[6/7] Deleting AWS Budget: $BUDGET_NAME..."
aws budgets delete-budget --account-id "$ACCOUNT_ID" --budget-name "$BUDGET_NAME" 2>/dev/null || echo "  -> Budget already deleted."

# 7. Revoke IAM Access Key
echo "[7/7] Revoking IAM Access Key: $ACCESS_KEY_ID..."
aws iam delete-access-key --user-name "$IAM_USER" --access-key-id "$ACCESS_KEY_ID" 2>/dev/null || echo "  -> IAM key already revoked."

echo ""
echo "================================================================"
echo "✅ All ClearCase AWS cloud resources have been terminated."
echo "================================================================"
