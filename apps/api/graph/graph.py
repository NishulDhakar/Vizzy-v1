from langgraph.graph import StateGraph, START, END
from graph.state import State
from graph.nodes import intent_node, chat_node, image_node


def _route(state: State) -> str:
    return state["intent"]


def build_graph():
    builder = StateGraph(State)

    builder.add_node("intent", intent_node)
    builder.add_node("chat", chat_node)
    builder.add_node("image", image_node)

    builder.add_edge(START, "intent")
    builder.add_conditional_edges("intent", _route, {"chat": "chat", "image": "image"})
    builder.add_edge("chat", END)
    builder.add_edge("image", END)

    return builder.compile()


graph = build_graph()



# START
#   ↓
# intent_node  → decides: "chat" or "image"
#   ↓
#  ┌───────────────┐
#  ↓               ↓
# chat_node     image_node
#  ↓               ↓
#  END            END