from typing import TypedDict, List, Dict


class State(TypedDict):
    messages: List[Dict[str, str]]
    response: str
    intent: str           # "chat" | "image"
    image_urls: List[str]
    user_id: str
    memories: List[str]
    user_profile: Dict
    image_count: int


