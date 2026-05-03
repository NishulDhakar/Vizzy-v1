from services.supabase_client import supabase
from services.embeddings import embed
from typing import List, Dict
from functools import wraps
import httpx
import time


_TRANSIENT = (httpx.ReadError, httpx.ConnectError, httpx.TimeoutException)

# ── Public DB functions ───────────────────────────────────────────────────────

def load_history(conversation_id: str) -> List[Dict[str, str]]:
    result = (
        supabase.table("conversations")
        .select("role, content")
        .eq("conversation_id", conversation_id)
        .order("created_at")
        .execute()
    )
    return [{"role": r["role"], "content": r["content"]} for r in result.data]


def save_message(conversation_id: str, user_id: str, role: str, content: str) -> None:
    supabase.table("conversations").insert(
        {
            "conversation_id": conversation_id,
            "user_id": user_id,
            "role": role,
            "content": content,
        }
    ).execute()


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
        return [r["content"] for r in result.data if r["similarity"] > 0.2]
    except Exception:
        return []


def upsert_memory(user_id: str, content: str, conversation_id: str ) -> None:
    """Save a memory, updating an existing one if a near-duplicate already exists.

    Cosine similarity > 0.88 → same concept, update in place.
    Below that → genuinely new fact, insert.
    """
    if not user_id:
        return
    try:
        embedding = embed(content)
        hit = supabase.rpc(
            "match_memories",
            {
                "query_embedding": embedding,
                "match_user_id": user_id,
                "match_count": 1,
            },
        ).execute()
        if hit.data and hit.data[0]["similarity"] > 0.88:
            supabase.table("memories").update(
                {"content": content, "embedding": embedding}
            ).eq("id", hit.data[0]["id"]).execute()
        else:
            supabase.table("memories").insert(
                {"user_id": user_id, "content": content, "embedding": embedding, "conversation_id": conversation_id, }
            ).execute()
    except Exception as e:
        print("Memory error:", e)

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
    except Exception as e:
        print("Memory error:", e)


def list_conversations(user_id: str) -> List[Dict]:
    if not user_id:
        return []

    try:
        result = supabase.rpc(
            "get_user_conversations",
            {"uid": user_id}
        ).execute()

        return result.data or []

    except Exception as e:
        print("List conversations error:", e)
        return []

def delete_conversation(conversation_id: str) -> None:
    supabase.table("conversations").delete().eq("conversation_id", conversation_id).execute()
