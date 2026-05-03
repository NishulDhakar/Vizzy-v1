from sentence_transformers import SentenceTransformer

# Load once (important for performance)
_model: SentenceTransformer | None = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def embed(text: str) -> list[float]:
    if not text.strip():
        return []

    try:
        model = _get_model()
        vector = model.encode(text)

        return vector.tolist()

    except Exception as e:
        print("Embedding error:", e)
        return []