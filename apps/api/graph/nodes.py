from graph.state import State
from services.llm import client, MODEL, SYSTEM_PROMPT
from services.image import generate_image


def intent_node(state: State) -> dict:
    """Classify the latest user message as 'chat' or 'image'."""
    last_user = next(
        (m["content"] for m in reversed(state["messages"]) if m["role"] == "user"),
        "",
    )
    result = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "Classify the user's request as exactly one word: "
                    "'image' if they want to generate, create, draw, or visualize an image/picture/photo, "
                    "otherwise 'chat'."
                ),
            },
            {"role": "user", "content": last_user},
        ],
        temperature=0,
        max_tokens=5,
    )
    intent = result.choices[0].message.content.strip().lower()
    if "image" not in intent:
        intent = "chat"
    return {"intent": intent}


def chat_node(state: State) -> dict:
    memories: list[str] = state.get("memories", [])
    profile: dict = state.get("user_profile", {})

    system = SYSTEM_PROMPT

    name = profile.get("full_name", "").strip()
    if name:
        system += f"\n\nThe user's name is {name}. Use their name naturally in conversation."

    if memories:
        facts = "\n".join(f"- {m}" for m in memories)
        system += f"\n\nAdditional facts you know about this user:\n{facts}"

    messages = [{"role": "system", "content": system}] + state["messages"]

    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.7,
        max_tokens=1024,
    )

    reply = response.choices[0].message.content
    updated_messages = state["messages"] + [{"role": "assistant", "content": reply}]

    return {
        "messages": updated_messages,
        "response": reply,
        "intent": "chat",
        "image_urls": [],
    }


def image_node(state: State) -> dict:
    last_user = next(
        (m["content"] for m in reversed(state["messages"]) if m["role"] == "user"),
        "an image",
    )

    # Strip conversational wrapper ("can you generate...", "make me a...", etc.)
    # so Pollinations receives a clean visual description, not a question.
    extraction = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "Extract a concise visual image prompt from the user's message. "
                    "Return ONLY the subject and style — no conversational words like "
                    "'generate', 'create', 'make', 'can you', 'please'. "
                    "Examples: 'dog on a beach at sunset' · 'abstract painting of sadness, dark blue tones'. "
                    "Max 20 words."
                ),
            },
            {"role": "user", "content": last_user},
        ],
        temperature=0,
        max_tokens=60,
    )
    clean_prompt = extraction.choices[0].message.content.strip().strip('"')

    count = state.get("image_count", 4)
    urls = generate_image(clean_prompt, count=count)

    reply = f"Here are {count} image{'s' if count != 1 else ''} for: *{clean_prompt}*"
    updated_messages = state["messages"] + [{"role": "assistant", "content": reply}]

    return {
        "messages": updated_messages,
        "response": reply,
        "intent": "image",
        "image_urls": urls,
    }
