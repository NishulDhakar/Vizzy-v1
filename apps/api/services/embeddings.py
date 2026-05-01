from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        api_key = os.getenv("GOOGLE_API_KEY", "")
        _client = genai.Client(api_key=api_key)
    return _client


def embed(text: str) -> list[float]:
    """Return a 768-dim embedding via Google text-embedding-004."""
    client = _get_client()
    response = client.models.embed_content(
        model="text-embedding-004",
        contents=text,
    )
    return list(response.embeddings[0].values)
