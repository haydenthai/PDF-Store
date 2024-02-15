create extension if not exists vector; -- enable pgvector

CREATE TABLE if not exists documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each document
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    metadata jsonb,
    content text,
    embedding vector(1536)
);

create or replace function match_documents (
    query_embedding vector(1536),
    match_count int default null,
    filter jsonb DEFAULT '{}'
)
    returns table (
      id uuid,
      content text,
      metadata jsonb,
      embedding jsonb,
      similarity float
    )
    language plpgsql
as $$
    #variable_conflict use_column
begin
    return query
    select
        id,
        content,
        metadata,
        (embedding::text)::jsonb as embedding,
        1 - (documents.embedding <=> query_embedding) as similarity
    from documents
    where metadata @> filter -- postgreSQL containment operator @>
    order by documents.embedding <=> query_embedding
    limit match_count;
end;
$$;

CREATE TABLE if not exists conversations (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     title text NOT NULL,
     user_id text NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
     messages jsonb NOT NULL DEFAULT '[]'::jsonb
);

