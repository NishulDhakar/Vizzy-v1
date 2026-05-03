from openai.types.realtime import conversation_item_added
from fastapi import APIRouter, BackgroundTasks, UploadFile, File
from pydantic import BaseModel
from graph.graph import graph
from services.db import (
    load_history,
    save_message,
    retrieve_memories,
    upsert_memory,
    list_conversations,
    delete_conversation,
    upsert_profile,
    get_profile,
)
from services.llm import client, MODEL
from services.voice import transcribe
import asyncio
import json
import uuid
from fastapi import HTTPException

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

def _extract_and_save_memory(user_id: str, user_message: str, ai_response: str, conversation_id: str) -> None:
    """Extract personal facts from the exchange and upsert them into long-term memory."""
    if not user_id:
        return
    try:
        extraction = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You extract memorable personal facts from chat exchanges for long-term personalization.\n"
                        "Extract ONLY facts that are stable and reusable across future conversations:\n"
                        "  • Name, age, location\n"
                        "  • Job, role, industry\n"
                        "  • Creative style, aesthetic preferences\n"
                        "  • Hobbies, passions, ongoing projects\n"
                        "  • Important personal context\n\n"
                        "Rules:\n"
                        "  • Each fact starts with 'User', e.g. 'User is a product designer'\n"
                        "  • Be concise — one fact per item, max ~12 words\n"
                        "  • Return a JSON array of strings. Return [] if nothing worth saving.\n"
                        "  • Max 3 facts."
                    ),
                },
                {
                    "role": "user",
                    "content": f"User: {user_message}\nAI: {ai_response}",
                },
            ],
            temperature=0,
            max_tokens=200,
        )
        raw = extraction.choices[0].message.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1].lstrip("json").strip()
        facts: list[str] = json.loads(raw)
        for fact in facts[:3]:
            if isinstance(fact, str) and fact.strip():
                upsert_memory(user_id, fact.strip(), conversation_id)
    except Exception as e:
        print("Memory error:", e)


# ── Chat ───────────────────────────────────────────────────────────────────────

@router.post("/chat")
async def chat(req: ChatRequest, background_tasks: BackgroundTasks):
    conv_id = req.conversation_id or str(uuid.uuid4())
    user_id = req.user_id or ""

    if user_id:
        background_tasks.add_task(
            upsert_profile, user_id, req.user_name, req.user_email, req.user_avatar
        )

    results = await asyncio.gather(
        asyncio.to_thread(load_history, conv_id),
        asyncio.to_thread(retrieve_memories, user_id, req.message),
        asyncio.to_thread(get_profile, user_id),
        return_exceptions=True,
    )

    if isinstance(results[0], Exception):
        print("load_history error:", results[0])
        history = []
    else:
        history = results[0]
        
    history  = results[0] if not isinstance(results[0], Exception) else []
    memories = results[1] if not isinstance(results[1], Exception) else []
    profile  = results[2] if not isinstance(results[2], Exception) else {}
    
    background_tasks.add_task(save_message, conv_id, user_id, "user", req.message)

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

    ai_reply = result.get("response", "")

    background_tasks.add_task(_extract_and_save_memory, user_id, req.message, ai_reply, conv_id)

    return {
        "text": ai_reply,
        "intent": result.get("intent", "chat"),
        "image_urls": result.get("image_urls", []),
        "search_results": [],
    }

# Request
#   ↓
# Load context (parallel)
#   ↓
# Save user message
#   ↓
# Run AI
#   ↓
# Save AI response
#   ↓
# Extract memory (background)
#   ↓
# Return response

# ── Conversation list ─────────────────────────────────────────────────────────

@router.get("/conversations/{user_id}")
async def get_conversations(user_id: str):
    try:
        convs = await asyncio.to_thread(list_conversations, user_id)
        return {"conversations": convs}
    except Exception as e:
        print("get_conversations error:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch conversations")


# ── Conversation history ───────────────────────────────────────────────────────

@router.get("/history/{conversation_id}")
async def get_history(conversation_id: str):
    try:
        messages = await asyncio.to_thread(load_history, conversation_id)
        return {"conversation_id": conversation_id, "messages": messages}
    except Exception as e:
        print("get_history error:", e)
        raise HTTPException(status_code=500, detail="Failed to load history")


@router.delete("/history/{conversation_id}")
async def clear_history(conversation_id: str):
    try:
        await asyncio.to_thread(delete_conversation, conversation_id)
        return {"cleared": conversation_id}
    except Exception as e:
        print("clear_history error:", e)
        raise HTTPException(status_code=500, detail="Failed to delete conversation")


# ── Semantic memory ────────────────────────────────────────────────────────────

@router.post("/memories")
async def add_memory(req: MemoryRequest):
    try:
        await asyncio.to_thread(
            upsert_memory,
            req.user_id,
            req.content,
            req.conversation_id
        )
        return {"saved": req.content}
    except Exception as e:
        print("add_memory error:", e)
        raise HTTPException(status_code=500, detail="Failed to save memory")


# ── Voice transcription ────────────────────────────────────────────────────────

@router.post("/voice")
async def voice_transcribe(audio: UploadFile = File(...)):
    try:
        if not audio:
            raise HTTPException(status_code=400, detail="No audio file provided")

        audio_bytes = await audio.read()

        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Empty audio file")

        text = await asyncio.to_thread(
            transcribe,
            audio_bytes,
            audio.filename or "recording.webm"
        )

        return {"text": text}

    except HTTPException:
        raise
    except Exception as e:
        print("voice_transcribe error:", e)
        raise HTTPException(status_code=500, detail="Failed to transcribe audio")