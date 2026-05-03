import requests
import os

HF_TOKEN = os.getenv("HF_TOKEN")

API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"

HEADERS = {
    "Authorization": f"Bearer {HF_TOKEN}"
}

def embed(text: str) -> list[float]:
    if not text.strip():
        return []

    try:
        res = requests.post(API_URL, headers=HEADERS, json={"inputs": text})
        data = res.json()

        return data[0]  # embedding vector

    except Exception as e:
        print("Embedding error:", e)
        return []