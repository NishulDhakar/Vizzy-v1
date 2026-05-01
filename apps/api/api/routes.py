from fastapi import APIRouter, BackgroundTasks, UploadFile, File
from pydantic import BaseModel
from graph.graph import graph
from services.db import (
    load_history,
    save_message,
    retrieve_memories,
    save_memory,
    list_memories,
    list_conversations,
    delete_memory,
    delete_conversation,
    upsert_profile,
    get_profile,
)
from services.llm import client, MODEL
from services.voice import transcribe
import asyncio
import json

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    conversation_id: str = "default"
    user_id: str = ""
    user_name: str = ""
    user_email: str = ""
    user_avatar: str = ""
    image_count: int = 4


class MemoryRequest(BaseModel):
    user_id: str
    content: str


# ── Background task: extract and save long-term facts ─────────────────────────

def _extract_and_save_memory(user_id: str, user_message: str, ai_response: str) -> None:
    """Ask the LLM to pull out any personal facts worth remembering, then save them."""
    if not user_id:
        return
    try:
        extraction = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Extract any personal facts about the user from their message "
                        "(e.g. name, occupation, preferences, style). "
                        'Return a JSON array of short strings like ["User likes minimalist design"]. '
                        "Return [] if there is nothing worth remembering long-term."
                    ),
                },
                {
                    "role": "user",
                    "content": f"User said: {user_message}\nAI replied: {ai_response}",
                },
            ],
            temperature=0,
            max_tokens=256,
        )
        raw = extraction.choices[0].message.content.strip()
        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1].lstrip("json").strip()
        facts: list[str] = json.loads(raw)
        for fact in facts[:3]:
            save_memory(user_id, str(fact))
    except Exception:
        pass


# ── Chat ───────────────────────────────────────────────────────────────────────

@router.post("/chat")
async def chat(req: ChatRequest, background_tasks: BackgroundTasks):
    conv_id = req.conversation_id or "default"
    user_id = req.user_id or ""

    # Upsert profile in background — don't block the critical path
    if user_id:
        background_tasks.add_task(
            upsert_profile, user_id, req.user_name, req.user_email, req.user_avatar
        )

    # Load history, memories, and profile in parallel.
    # return_exceptions=True means a single Supabase hiccup can't crash the request.
    results = await asyncio.gather(
        asyncio.to_thread(load_history, conv_id),
        asyncio.to_thread(retrieve_memories, user_id, req.message),
        asyncio.to_thread(get_profile, user_id),
        return_exceptions=True,
    )
    history  = results[0] if not isinstance(results[0], Exception) else []
    memories = results[1] if not isinstance(results[1], Exception) else []
    profile  = results[2] if not isinstance(results[2], Exception) else {}

    # Persist the new user message (best-effort, background)
    background_tasks.add_task(save_message, conv_id, user_id, "user", req.message)

    # Append to in-flight history for the LLM
    history = history + [{"role": "user", "content": req.message}]

    try:
        result = await asyncio.to_thread(
            graph.invoke,
            {
                "messages": history,
                "response": "",
                "intent": "chat",
                "image_urls": [],
                "user_id": user_id,
                "user_profile": profile,
                "memories": memories,
                "image_count": max(1, min(req.image_count, 8)),
            },
        )
    except Exception as exc:
        return {
            "text": "Something went wrong on my end. Please try again.",
            "intent": "chat",
            "image_urls": [],
            "search_results": [],
            "error": str(exc),
        }

    ai_reply: str = result["response"]

    background_tasks.add_task(save_message, conv_id, user_id, "assistant", ai_reply)
    background_tasks.add_task(_extract_and_save_memory, user_id, req.message, ai_reply)

    return {
        "text": ai_reply,
        "intent": result["intent"],
        "image_urls": result["image_urls"],
        "search_results": [],
    }


# ── Conversation list ─────────────────────────────────────────────────────────

@router.get("/conversations/{user_id}")
async def get_conversations(user_id: str):
    convs = await asyncio.to_thread(list_conversations, user_id)
    return {"conversations": convs}


# ── Conversation history ───────────────────────────────────────────────────────

@router.get("/history/{conversation_id}")
async def get_history(conversation_id: str):
    messages = await asyncio.to_thread(load_history, conversation_id)
    return {"conversation_id": conversation_id, "messages": messages}


@router.delete("/history/{conversation_id}")
async def clear_history(conversation_id: str):
    await asyncio.to_thread(delete_conversation, conversation_id)
    return {"cleared": conversation_id}


# ── Semantic memory ────────────────────────────────────────────────────────────

@router.get("/memories/{user_id}")
async def get_memories(user_id: str):
    memories = await asyncio.to_thread(list_memories, user_id)
    return {"user_id": user_id, "memories": memories}


@router.post("/memories")
async def add_memory(req: MemoryRequest):
    await asyncio.to_thread(save_memory, req.user_id, req.content)
    return {"saved": req.content}


@router.delete("/memories/{memory_id}")
async def remove_memory(memory_id: str):
    await asyncio.to_thread(delete_memory, memory_id)
    return {"deleted": memory_id}


# ── Voice transcription ────────────────────────────────────────────────────────

@router.post("/voice")
async def voice_transcribe(audio: UploadFile = File(...)):
    audio_bytes = await audio.read()
    text = await asyncio.to_thread(transcribe, audio_bytes, audio.filename or "recording.webm")
    return {"text": text}
