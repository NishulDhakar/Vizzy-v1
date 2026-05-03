from graph.state import State
from services.llm import client, MODEL, SYSTEM_PROMPT
from services.image import generate_image
import re


def intent_node(state: State) -> dict:
    """Classify the latest user message as 'chat' or 'image'."""
    last_user_message = next(
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
            {"role": "user", "content": last_user_message},
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

    last_user = next(
        (m["content"] for m in reversed(state["messages"]) if m["role"] == "user"),
        "",
    )

    name_match = re.search(r"\bmy name is (\w+)", last_user.lower())
    override_name = name_match.group(1).capitalize() if name_match else None

    final_name = override_name or profile.get("full_name", "").strip()

    system = SYSTEM_PROMPT

    if final_name:
        system += f"\n\nThe user's name is {final_name}. Use it naturally."

    if memories:
        facts = "\n".join(f"- {m}" for m in memories)
        system += f"\n\nKnown facts about user:\n{facts}"

    messages = [{"role": "system", "content": system}] + state["messages"]

    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.7,
        max_tokens=1024,
    )

    reply = response.choices[0].message.content or "Sorry, I couldn't respond."

    updated_messages = state["messages"] + [
        {"role": "assistant", "content": reply}
    ]

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

    count_match = re.search(r"\b(\d+)\b", last_user)
    if count_match:
        count = int(count_match.group(1))
        count = max(1, min(count, 8))
    else:
        count = state.get("image_count", 1)

    extraction = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "Extract a clean visual prompt from the user's request. "
                    "Remove conversational words like 'generate', 'create', 'please'. 'make' "
                    "Return only subject + style in under 20 words."
                ),
            },
            {"role": "user", "content": last_user},
        ],
        temperature=0,
        max_tokens=60,
    )

    clean_prompt = extraction.choices[0].message.content.strip().strip('"')

    urls = generate_image(clean_prompt, count=count)

    reply = f"Here are {count} image{'s' if count != 1 else ''} for: *{clean_prompt}*"

    updated_messages = state["messages"] + [
        {"role": "assistant", "content": reply}
    ]

    return {
        "messages": updated_messages,
        "response": reply,
        "intent": "image",
        "image_urls": urls,
    }