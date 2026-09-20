# ClearCase: AWS Configuration & Cloud Services Architecture

This document explains the cloud services utilized by Project ClearCase, how they are configured, and the Infrastructure-as-Code (IaC) templates managing them.

---

## 1. AWS Cloud Services Inventory

| Service | Role in ClearCase | Configuration / Model |
| :--- | :--- | :--- |
| **Amazon Bedrock** | Core LLM reasoning & statutory embeddings | `anthropic.claude-3-5-sonnet-20240620-v1:0` & `amazon.titan-embed-text-v1` |
| **Amazon DynamoDB** | Single-table persistence for cases, parties, and immutable audit events | Single-table schema (`ClearCaseTable`), GSI1 `MediatorQueueIndex`, TTL on `otpExpiry` |
| **Amazon Polly** | Regional voice synthesis for illiterate disputants | Neural Indian voices: `Kajal` (Hindi/Bilingual) & `Aditi` (Hindi/English) |
| **Amazon Simple Storage Service (S3)** | Dialect audio recordings & synthesized settlement audio storage | Presigned PUT/GET URLs with expiration policies (`clearcase-audio` bucket) |
| **AWS Lambda & API Gateway** | Serverless REST API routing and event handling | Node.js 20.x runtime, single catch-all handler (`src/app.ts`), SAM template |
| **AWS Cedar** | Fine-grained, jurisdiction-based authorization policy engine | Enforces disputant case isolation and mediator district boundaries (`clearcase.cedar`) |
| **Amazon OpenSearch Service** | Cloud vector database for state legislative acts corpus | k-NN vector search with cosine similarity |

---

## 2. Infrastructure-as-Code (AWS SAM Template)

The complete AWS serverless infrastructure is codified in [template.yaml](file:///c:/Hackathons%20and%20projects/Bharat_Builds/template.yaml):

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: ClearCase Serverless Backend & AI Mesh for Bharat

Globals:
  Function:
    Timeout: 30
    MemorySize: 512
    Runtime: nodejs20.x
    Environment:
      Variables:
        TABLE_NAME: !Ref ClearCaseTable
        AWS_REGION: !Ref AWS::Region
        BEDROCK_MODEL_ID: anthropic.claude-3-5-sonnet-20240620-v1:0
        MOCK_AI: 'true'
        MOCK_BLOCKCHAIN: 'true'

Resources:
  ClearCaseTable:
    Type: AWS::DynamoDB::Table
    Properties:
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: PK
          AttributeType: S
        - AttributeName: SK
          AttributeType: S
        - AttributeName: GSI1PK
          AttributeType: S
        - AttributeName: GSI1SK
          AttributeType: S
      KeySchema:
        - AttributeName: PK
          KeyType: HASH
        - AttributeName: SK
          KeyType: RANGE
      GlobalSecondaryIndexes:
        - IndexName: MediatorQueueIndex
          KeySchema:
            - AttributeName: GSI1PK
              KeyType: HASH
            - AttributeName: GSI1SK
              KeyType: RANGE
          Projection:
            ProjectionType: ALL
      TimeToLiveSpecification:
        AttributeName: otpExpiry
        Enabled: true
```

---

## 3. AWS Cedar Fine-Grained Authorization Policies

Access control is enforced in [policies/clearcase.cedar](file:///c:/Hackathons%20and%20projects/Bharat_Builds/policies/clearcase.cedar):
- **Rule 1 (Citizen Privacy Isolation)**: A citizen can only read, verify consent, or access cases where their phone number is registered as an active party.
- **Rule 2 (Mediator District Boundaries)**: A mediator assigned to `Varanasi` cannot query or inspect cases originating in `Sonipat` or other jurisdictions.
- **Rule 3 (Mediator Review Authorization)**: Only authorized mediators within the dispute's jurisdiction can submit revised compromise drafts or override AI outputs.
