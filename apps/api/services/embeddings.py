import hashlib
import math

def embed(text: str, dim: int = 384) -> list[float]:
    if not text.strip():
        return []

    # hash-based pseudo embedding (very light)
    h = hashlib.sha256(text.encode()).digest()

    # convert bytes → numbers
    vec = [b / 255.0 for b in h]

    # repeat to match dimension
    while len(vec) < dim:
        vec += vec

    return vec[:dim]