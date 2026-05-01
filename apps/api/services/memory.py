from supabase import create_client
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

async def save_memory(user_id: str, conversation_id: str, content: str):
    # generate embedding
    embedding = embeddings.embed_query(content)
    
    supabase.table("memories").insert({
        "user_id": user_id,
        "conversation_id": conversation_id,
        "content": content,
        "embedding": embedding
    }).execute()

async def get_relevant_memories(user_id: str, query: str, limit: int = 3):
    # embed the query
    query_embedding = embeddings.embed_query(query)
    
    # vector similarity search
    result = supabase.rpc("match_memories", {
        "query_embedding": query_embedding,
        "match_user_id": user_id,
        "match_count": limit
    }).execute()
    
    return result.data