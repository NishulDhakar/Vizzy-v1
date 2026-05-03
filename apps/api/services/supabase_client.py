from supabase import create_client, Client, ClientOptions
from dotenv import load_dotenv
import httpx
import os

load_dotenv()

_http = httpx.Client(
    limits=httpx.Limits(
        max_connections=20,
        max_keepalive_connections=10,
        keepalive_expiry=30,
    ),
    timeout=httpx.Timeout(30.0, connect=10.0),
)

supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_KEY", ""),
    options=ClientOptions(
        postgrest_client_timeout=30,
        httpx_client=_http,
    ),
)
