# ClearCase: Deploying the Backend on Render Guide

This guide provides step-by-step instructions for deploying the **ClearCase Python AI & Mediation Gateway** (`backend/api.py`) on **[Render](https://render.com/)** using the Free Tier.

---

## 1. Prerequisites
- A free account on **[Render.com](https://dashboard.render.com/)**.
- Your GitHub repository connected to Render.

---

## 2. Deploy Method A: Render Blueprint (Easiest / 1-Click)

The repository includes a ready-to-use [`render.yaml`](../../render.yaml) file.

1. Go to your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** in the top right → Select **Blueprint**.
3. Select your repository (`ClearCase`).
4. Render will automatically detect `render.yaml` and configure:
   - **Service Name**: `clearcase-backend`
   - **Environment**: Python
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
5. When prompted for secret environment variables, copy them directly from your local `backend/.env`:
   - `GROQ_API_KEY`: *(Value from `backend/.env`)*
   - `AWS_ACCESS_KEY_ID`: *(Value from `backend/.env`)*
   - `AWS_SECRET_ACCESS_KEY`: *(Value from `backend/.env`)*
6. Click **Apply**. Render will build and launch your service!

---

## 3. Deploy Method B: Manual Web Service Setup

If you prefer creating the Web Service manually in the Render dashboard:

1. In the **Render Dashboard**, click **New +** → Select **Web Service**.
2. Choose **Build and deploy from a Git repository** and select your repo.
3. Configure the fields as follows:

| Setting | Value |
| :--- | :--- |
| **Name** | `clearcase-backend` |
| **Region** | `Oregon (US West)` or `Ohio (US East)` |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn api:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` ($0/month) |

4. Scroll down to **Environment Variables** and add the following keys (copy values from `backend/.env`):

```env
PYTHON_VERSION=3.11.9
PORT=10000
MOCK_AI=false
EMBEDDING_PROVIDER=local
VECTOR_STORE=local
AWS_REGION=us-east-1
TABLE_NAME=ClearCaseTable-Prod
AUDIO_BUCKET=clearcase-audio-517025126295-us-east-1
GROQ_MODEL_ID=openai/gpt-oss-20b
GROQ_FALLBACK_MODEL_ID=openai/gpt-oss-120b
POLYGON_RPC_URL=https://polygon-amoy.drpc.org
CLEARCASE_REGISTRY_ADDRESS=0x700529c7b25f0ebae903c8Ca1EDcC09Fac1280d2
GROQ_API_KEY=your_groq_api_key_from_env
AWS_ACCESS_KEY_ID=your_aws_access_key_from_env
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_from_env
```

5. Click **Create Web Service**.

---

## 4. Testing Your Deployed Backend

Once Render displays **"Live"**, your service URL will look like:
`https://clearcase-backend.onrender.com`

Verify it with:
1. Health Check: `https://clearcase-backend.onrender.com/health` (returns `{"status": "online", "vector_store": "ready"}`).
2. Interactive Swagger Docs: `https://clearcase-backend.onrender.com/docs`.

---

## 5. Connecting Render to Your Vercel Frontend

To connect your live Vercel frontend (`https://clearcase-studio.vercel.app`) to your Render backend:

1. Open your **Vercel Project Settings** (`clearcase-studio`) → **Environment Variables**.
2. Add a new variable:
   - **Key**: `VITE_AI_SERVICE_URL`
   - **Value**: `https://your-render-service-name.onrender.com`
3. Click **Save** and trigger a redeploy on Vercel.
4. Your frontend will now communicate live with your Render backend for real-time vernacular audio transcription, Groq AI statutory analysis, and Polly speech synthesis!
