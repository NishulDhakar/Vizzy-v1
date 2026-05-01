from services.supabase_client import supabase
from services.embeddings import embed
from typing import List, Dict
from functools import wraps
import httpx
import time


# ── Retry helper ──────────────────────────────────────────────────────────────
# Errno 35 (EAGAIN) surfaces as httpx.ReadError when the connection pool is
# hit concurrently from multiple asyncio.to_thread workers.  Three attempts
# with exponential back-off (0.3 s, 0.6 s) clears it in practice.

_TRANSIENT = (httpx.ReadError, httpx.ConnectError, httpx.TimeoutException)


def _retried(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        for attempt in range(3):
            try:
                return fn(*args, **kwargs)
            except _TRANSIENT:
                if attempt == 2:
                    raise
                time.sleep(0.3 * (2 ** attempt))
    return wrapper


# ── Public DB functions ───────────────────────────────────────────────────────

@_retried
def load_history(conversation_id: str) -> List[Dict[str, str]]:
    result = (
        supabase.table("conversations")
        .select("role, content")
        .eq("conversation_id", conversation_id)
        .order("created_at")
        .execute()
    )
    return [{"role": r["role"], "content": r["content"]} for r in result.data]


@_retried
def save_message(conversation_id: str, user_id: str, role: str, content: str) -> None:
    supabase.table("conversations").insert(
        {
            "conversation_id": conversation_id,
            "user_id": user_id,
            "role": role,
            "content": content,
        }
    ).execute()


@_retried
def get_profile(user_id: str) -> Dict:
    if not user_id:
        return {}
    try:
        result = (
            supabase.table("profiles")
            .select("full_name, email, avatar_url")
            .eq("id", user_id)
            .single()
            .execute()
        )
        return result.data or {}
    except Exception:
        return {}


@_retried
def retrieve_memories(user_id: str, query: str, top_k: int = 4) -> List[str]:
    if not user_id:
        return []
    try:
        query_embedding = embed(query)
        result = supabase.rpc(
            "match_memories",
            {
                "query_embedding": query_embedding,
                "match_user_id": user_id,
                "match_count": top_k,
            },
        ).execute()
        return [r["content"] for r in result.data if r["similarity"] > 0.3]
    except Exception:
        return []


def save_memory(user_id: str, content: str) -> None:
    if not user_id:
        return
    try:
        embedding = embed(content)
        supabase.table("memories").insert(
            {"user_id": user_id, "content": content, "embedding": embedding}
        ).execute()
    except Exception:
        pass


@_retried
def list_memories(user_id: str) -> List[Dict]:
    result = (
        supabase.table("memories")
        .select("id, content, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


def delete_memory(memory_id: str) -> None:
    supabase.table("memories").delete().eq("id", memory_id).execute()


def upsert_profile(user_id: str, name: str = "", email: str = "", avatar_url: str = "") -> None:
    try:
        supabase.table("profiles").upsert(
            {
                "id": user_id,
                "full_name": name,
                "email": email,
                "avatar_url": avatar_url,
            },
            on_conflict="id",
        ).execute()
    except Exception:
        pass


@_retried
def list_conversations(user_id: str) -> List[Dict]:
    if not user_id:
        return []
    result = (
        supabase.table("conversations")
        .select("conversation_id, role, content, created_at")
        .eq("user_id", user_id)
        .order("created_at")
        .execute()
    )
    convs: dict[str, dict] = {}
    for row in result.data:
        cid = row["conversation_id"]
        if cid not in convs:
            title = row["content"][:60] if row["role"] == "user" else "Chat"
            convs[cid] = {
                "conversation_id": cid,
                "title": title,
                "created_at": row["created_at"],
                "updated_at": row["created_at"],
                "message_count": 1,
            }
        else:
            convs[cid]["updated_at"] = row["created_at"]
            convs[cid]["message_count"] += 1
    return sorted(convs.values(), key=lambda x: x["updated_at"], reverse=True)


def delete_conversation(conversation_id: str) -> None:
    supabase.table("conversations").delete().eq("conversation_id", conversation_id).execute()
