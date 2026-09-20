# ClearCase: Credentials & Secret Keys Setup Guide

This guide details every credential, API key, and environment configuration required to run ClearCase in cloud production, developer sandbox, or zero-config hackathon demo mode.

---

## 1. Quick Reference: Environment Variables

Create a `.env` file in the root directory (never commit `.env` to Git):

```env
# ==============================================================================
# 1. AWS Cloud Infrastructure Credentials
# ==============================================================================
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
# Optional IAM Session Token (if using temporary AWS Learner Lab / SSO credentials)
# AWS_SESSION_TOKEN=...

# Amazon Bedrock Model Configuration
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
BEDROCK_EMBEDDING_MODEL_ID=amazon.titan-embed-text-v1

# ==============================================================================
# 2. Open-Source LLM Fallback (Groq Cloud)
# ==============================================================================
GROQ_API_KEY=gsk_...
GROQ_MODEL_ID=llama-3.3-70b-versatile

# ==============================================================================
# 3. Hybrid AI Engine Flags
# ==============================================================================
# When true, bypasses cloud calls and returns calibrated high-fidelity legal responses
MOCK_AI=true
EMBEDDING_PROVIDER=local
VECTOR_STORE=chroma
PORT=8000
AI_SERVICE_URL=http://127.0.0.1:8000
USE_PYTHON_AI=true

# ==============================================================================
# 4. DynamoDB Local & Cloud Configuration
# ==============================================================================
TABLE_NAME=ClearCaseTable-local
DYNAMODB_ENDPOINT=http://localhost:8000

# ==============================================================================
# 5. Polygon Amoy Blockchain Anchoring
# ==============================================================================
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology/
CLEARCASE_REGISTRY_ADDRESS=0x435A9D490EbF92C32D19D20888913B0957917C5B
PRIVATE_KEY=mock-key
MOCK_BLOCKCHAIN=true
```

---

## 2. Step-by-Step: How to Obtain Each Credential

### A. AWS Credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
1. Log in to your [AWS Management Console](https://console.aws.amazon.com/).
2. Navigate to **IAM (Identity and Access Management)** -> **Users** -> Your Username.
3. Select the **Security credentials** tab.
4. Under **Access keys**, click **Create access key**.
5. Select **Command Line Interface (CLI)**, acknowledge, and copy the Access Key ID and Secret Access Key.
6. **Required IAM Permissions**:
   - `bedrock:InvokeModel`
   - `polly:SynthesizeSpeech`
   - `dynamodb:*` (for ClearCaseTable)
   - `s3:PutObject`, `s3:GetObject` (for audio storage)
7. **Bedrock Model Access**:
   - Go to **Amazon Bedrock** in `us-east-1` or `ap-south-1`.
   - Click **Model access** in the bottom-left sidebar.
   - Click **Modify model access**, check **Claude 3.5 Sonnet** and **Titan Embeddings G1 - Text**, and click **Submit**.

---

### B. Groq API Key (`GROQ_API_KEY`)
1. Visit [Groq Cloud Console](https://console.groq.com/).
2. Sign up or log in with GitHub / Google.
3. Click **API Keys** in the left navigation.
4. Click **Create API Key**, name it `ClearCase-Demo`, and copy the key (starts with `gsk_`).
5. Groq provides generous free-tier access with sub-second latency for `llama-3.3-70b-versatile` and `qwen-2.5-32b`.

---

### C. Polygon Amoy Testnet & Private Key
1. **RPC URL**: `https://rpc-amoy.polygon.technology/` (Chain ID: 80002).
2. **Testnet POL Faucet**: Get free testnet tokens from the [Polygon Faucet](https://faucet.polygon.technology/).
3. **Deploying the Registry Contract**:
   - The contract is located in [contracts/ClearCaseRegistry.sol](file:///c:/Hackathons%20and%20projects/Bharat_Builds/contracts/ClearCaseRegistry.sol).
   - Our pre-deployed contract address on Amoy testnet is:
     `0x435A9D490EbF92C32D19D20888913B0957917C5B`.
4. If testing offline or without testnet tokens, set `MOCK_BLOCKCHAIN=true` to simulate block confirmations with realistic Polygonscan explorer URLs.
