# ClearCase: AWS Services Termination & Complete Teardown Guide

This comprehensive guide explains how to safely and completely decommission, terminate, and remove all AWS cloud resources provisioned for **Project ClearCase**. 

Follow these steps when concluding the project or when you wish to wipe all cloud footprints to ensure **zero ongoing costs**.

---

## 1. Inventory of Provisioned AWS Resources

The following resources were provisioned in your AWS account (`517025126295`) in Region **`us-east-1` (US East, N. Virginia)**:

| Service | Resource Name / Identifier | Monthly Cost When Idle |
| :--- | :--- | :--- |
| **Amazon DynamoDB** | `ClearCaseTable-Prod` (Pay-Per-Request On-Demand + 2 GSIs) | $0.00 |
| **Amazon S3** | `clearcase-audio-517025126295-us-east-1` (Audio intake storage) | $0.00 (empty) |
| **AWS Systems Manager (SSM)** | 6 parameters under `/clearcase/*` (Standard tier) | $0.00 |
| **Amazon CloudWatch** | `ClearCase-Dispute-Escalation-Alarm` (Metric alarm) | $0.00 (Free Tier covers up to 10 alarms) |
| **Amazon SNS** | `ClearCase-Dispute-Alerts` (`arn:aws:sns:us-east-1:517025126295:...`) | $0.00 |
| **AWS Budgets** | `ClearCase-10-USD-Limit` ($10.00 monthly threshold) | $0.00 (First 2 budgets free) |
| **IAM User Credentials** | User `clearcase-dev` (Access Key `AKIAXQYIZK6LZHG7DI34`) | $0.00 |
| **Amazon Polly** | Neural TTS (Synthesized on-demand via `POST /speak`) | $0.00 (Serverless, pay-per-request) |

---

## 2. Fast Automated Teardown (1-Click CLI Script)

An automated cleanup script is provided at `backend/scripts/teardown-aws.sh`. You can execute it directly from the repository root:

```bash
# Make the script executable (if needed)
chmod +x backend/scripts/teardown-aws.sh

# Run the teardown script
./backend/scripts/teardown-aws.sh
```

### What the Script Executes:

```bash
#!/usr/bin/env bash
set -e

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

# 1. Empty and Delete Amazon S3 Audio Storage Bucket
echo "[1/7] Deleting S3 audio bucket: $BUCKET_NAME..."
aws s3 rm "s3://${BUCKET_NAME}" --recursive --region "$REGION" 2>/dev/null || true
aws s3api delete-bucket --bucket "$BUCKET_NAME" --region "$REGION" || echo "S3 bucket already deleted or not found."

# 2. Delete Amazon DynamoDB Primary Table
echo "[2/7] Deleting DynamoDB table: $TABLE_NAME..."
aws dynamodb delete-table --table-name "$TABLE_NAME" --region "$REGION" || echo "DynamoDB table already deleted or not found."

# 3. Delete CloudWatch Alarm
echo "[3/7] Deleting CloudWatch alarm: $ALARM_NAME..."
aws cloudwatch delete-alarms --alarm-names "$ALARM_NAME" --region "$REGION" || echo "CloudWatch alarm already deleted."

# 4. Delete Amazon SNS Topic
echo "[4/7] Deleting SNS alert topic: $TOPIC_ARN..."
aws sns delete-topic --topic-arn "$TOPIC_ARN" --region "$REGION" || echo "SNS topic already deleted."

# 5. Delete Systems Manager Parameter Store Keys
echo "[5/7] Deleting SSM Parameter Store keys under /clearcase/..."
aws ssm delete-parameters --names \
  "/clearcase/env" \
  "/clearcase/dynamodb/table" \
  "/clearcase/s3/audio_bucket" \
  "/clearcase/sns/topic_arn" \
  "/clearcase/ai/provider" \
  "/clearcase/policies/cedar" \
  --region "$REGION" || echo "SSM parameters already deleted."

# 6. Delete AWS Budget
echo "[6/7] Deleting AWS Budget: $BUDGET_NAME..."
aws budgets delete-budget --account-id "$ACCOUNT_ID" --budget-name "$BUDGET_NAME" || echo "Budget already deleted."

# 7. Revoke IAM Access Key
echo "[7/7] Revoking IAM Access Key: $ACCESS_KEY_ID..."
aws iam delete-access-key --user-name "$IAM_USER" --access-key-id "$ACCESS_KEY_ID" || echo "IAM key already revoked."

echo "================================================================"
echo "✅ All ClearCase AWS cloud resources have been terminated."
echo "================================================================"
```

---

## 3. Manual Step-by-Step Teardown (AWS Web Console)

If you prefer to verify and terminate services visually through the AWS Management Console:

### Step 1: Amazon S3 (Storage)
1. Go to **[Amazon S3 Console](https://s3.console.aws.amazon.com/s3/home?region=us-east-1)**.
2. Locate bucket `clearcase-audio-517025126295-us-east-1`.
3. Select the bucket and click **Empty**. Type `permanently delete` and confirm.
4. With the bucket empty, click **Delete**, type the bucket name to confirm, and click **Delete bucket**.

### Step 2: Amazon DynamoDB (Database)
1. Go to **[Amazon DynamoDB Console](https://us-east-1.console.aws.amazon.com/dynamodbv2/home?region=us-east-1#tables)**.
2. Click **Tables** on the left navigation bar.
3. Select `ClearCaseTable-Prod`.
4. Click **Delete table**. Uncheck any CloudWatch alarm deletion boxes if prompted, type `confirm`, and click **Delete**.

### Step 3: CloudWatch & SNS (Monitoring & Alerts)
1. Go to **[CloudWatch Alarms Console](https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#alarmsV2:)**.
2. Select `ClearCase-Dispute-Escalation-Alarm`.
3. Click **Actions** → **Delete**.
4. Go to **[Amazon SNS Topics Console](https://us-east-1.console.aws.amazon.com/sns/v3/home?region=us-east-1#/topics)**.
5. Select `ClearCase-Dispute-Alerts`.
6. Click **Delete** and confirm.

### Step 4: AWS Systems Manager (Parameter Store)
1. Go to **[Systems Manager Parameter Store](https://us-east-1.console.aws.amazon.com/systems-manager/parameters?region=us-east-1)**.
2. In the search box, filter by `/clearcase`.
3. Select all 6 parameters:
   - `/clearcase/env`
   - `/clearcase/dynamodb/table`
   - `/clearcase/s3/audio_bucket`
   - `/clearcase/sns/topic_arn`
   - `/clearcase/ai/provider`
   - `/clearcase/policies/cedar`
4. Click **Delete** and confirm.

### Step 5: AWS Budgets
1. Go to **[AWS Billing & Budgets Console](https://console.aws.amazon.com/billing/home#/budgets)**.
2. Select `ClearCase-10-USD-Limit`.
3. Click **Actions** → **Delete**.

### Step 6: IAM User & Access Keys (Security Cleanup)
1. Go to **[IAM Users Console](https://us-east-1.console.aws.amazon.com/iam/home#/users)**.
2. Click on user `clearcase-dev`.
3. Switch to the **Security credentials** tab.
4. Under **Access keys**, find `AKIAXQYIZK6LZHG7DI34`.
5. Click **Actions** → **Deactivate**, then **Delete**.
6. (Optional) If you want to delete the user entirely, return to the Users list, select `clearcase-dev`, and click **Delete**.

---

## 4. Completely Closing Your Entire AWS Account

If you do not intend to use AWS for any other projects and want to permanently close the account:

1. Sign in as the **AWS Account Root User** at [https://console.aws.amazon.com/](https://console.aws.amazon.com/).
2. In the top navigation bar on the far right, click on your account name / ID (`517025126295`).
3. Select **Account** from the dropdown menu.
4. Scroll all the way down to the bottom section labeled **Close Account**.
5. Check all required confirmation checkboxes acknowledging that all resources will be terminated and access will cease.
6. Click **Close Account**.
7. AWS will send a confirmation email and the account enters a 90-day post-closure period before permanent purge.

---

## 5. Post-Teardown Verification Checklist

After performing either the CLI or manual teardown, verify your account status:

* [ ] DynamoDB: No tables matching `ClearCase*` listed in `us-east-1`.
* [ ] S3: Bucket `clearcase-audio-517025126295-us-east-1` no longer exists.
* [ ] CloudWatch: 0 active alarms under `ClearCase*`.
* [ ] SSM Parameter Store: 0 parameters starting with `/clearcase/`.
* [ ] SNS: Topic `ClearCase-Dispute-Alerts` is gone.
* [ ] Billing Dashboard: Forecasted monthly charges remain **$0.00**.
