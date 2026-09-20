import os
import io
import requests
from typing import Optional, Dict, Any

GROQ_WHISPER_URL = "https://api.groq.com/openai/v1/audio/transcriptions"

def transcribe_audio_with_groq_whisper(
    audio_bytes: bytes,
    filename: str = "recording.webm",
    mime_type: str = "audio/webm",
    dialect_or_language: Optional[str] = None,
    prompt: Optional[str] = None
) -> Dict[str, Any]:
    """
    Transcribes raw audio bytes using Groq Whisper Large v3 (whisper-large-v3).
    Supports Hindi, Bhojpuri, Haryanvi, Awadhi, English, and regional dialects.
    """
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise ValueError("GROQ_API_KEY is not set in environment.")

    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "User-Agent": "ClearCase/1.0"
    }

    # Map dialect to ISO language hint for Whisper if appropriate
    lang = None
    if dialect_or_language:
        d = dialect_or_language.lower()
        if d in ["hindi", "bhojpuri", "awadhi", "haryanvi", "maithili", "rajasthani", "hi"]:
            lang = "hi"
        elif d in ["english", "en"]:
            lang = "en"

    files = {
        "file": (filename, audio_bytes, mime_type)
    }
    data: Dict[str, Any] = {
        "model": "whisper-large-v3",
        "response_format": "json",
        "temperature": 0.0
    }
    if lang:
        data["language"] = lang
    if prompt:
        data["prompt"] = prompt

    response = requests.post(
        GROQ_WHISPER_URL,
        headers=headers,
        files=files,
        data=data,
        timeout=30
    )

    if response.status_code != 200:
        raise RuntimeError(f"Groq Whisper transcription failed ({response.status_code}): {response.text}")

    result = response.json()
    return {
        "text": result.get("text", "").strip(),
        "model": "whisper-large-v3",
        "provider": "Groq Cloud"
    }
