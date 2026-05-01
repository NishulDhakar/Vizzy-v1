-- Run this once in the Supabase SQL editor (Database → SQL Editor → New query)

-- 1. Enable pgvector (may already be on)
create extension if not exists vector with schema extensions;

-- 2. Memories table
create table if not exists public.memories (
  id          uuid        default gen_random_uuid() primary key,
  user_id     text        not null,
  content     text        not null,
  embedding   vector(768),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists memories_user_id_idx
  on public.memories (user_id);

-- ivfflat index for fast ANN search; tune lists= after the table has rows
create index if not exists memories_embedding_idx
  on public.memories
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 3. Auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists memories_set_updated_at on public.memories;
create trigger memories_set_updated_at
  before update on public.memories
  for each row execute function public.set_updated_at();

-- 4. Vector similarity search (returns id so the caller can upsert)
create or replace function public.match_memories(
  query_embedding vector(768),
  match_user_id   text,
  match_count     int default 5
)
returns table (
  id         uuid,
  content    text,
  similarity float
)
language sql stable as $$
  select
    id,
    content,
    1 - (embedding <=> query_embedding) as similarity
  from public.memories
  where user_id     = match_user_id
    and embedding   is not null
  order by embedding <=> query_embedding
  limit match_count;
$$;
