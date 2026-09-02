-- Full Aegis document library. Every imported PDF remains a separate dossier,
-- while its pages and existing table of contents stay available for navigation.

alter table aegis.source_documents
  add column if not exists owner_platform text not null default 'aegis';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'source_documents_owner_platform_check'
      and conrelid = 'aegis.source_documents'::regclass
  ) then
    alter table aegis.source_documents
      add constraint source_documents_owner_platform_check
      check (owner_platform in (
        'aegis', 'meridian', 'phosphoros', 'aegora', 'avera', 'civiora', 'ampara'
      ));
  end if;
end
$$;

create table if not exists aegis.dossier_documents (
  dossier_id uuid not null references aegis.knowledge_objects(id) on delete cascade,
  source_document_id uuid not null references aegis.source_documents(id) on delete cascade,
  role text not null default 'source',
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (dossier_id, source_document_id)
);

create table if not exists aegis.document_sections (
  id uuid primary key default gen_random_uuid(),
  source_document_id uuid not null references aegis.source_documents(id) on delete cascade,
  stable_key text not null,
  title text not null,
  page_number integer not null check (page_number > 0),
  level integer not null default 0 check (level >= 0),
  position integer not null default 0,
  tab_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (source_document_id, stable_key),
  check (jsonb_typeof(metadata) = 'object')
);

create index if not exists dossier_documents_dossier_position_idx
  on aegis.dossier_documents (dossier_id, position);

create index if not exists document_sections_document_position_idx
  on aegis.document_sections (source_document_id, position);

alter table aegis.dossier_documents enable row level security;
alter table aegis.document_sections enable row level security;

drop policy if exists "public source documents are readable" on aegis.source_documents;
drop policy if exists "published Aegis source documents are public" on aegis.source_documents;
create policy "published Aegis source documents are public"
  on aegis.source_documents for select to anon, authenticated
  using (
    owner_platform = 'aegis'
    and access_level = 'public'
    and exists (
      select 1
      from aegis.dossier_documents dd
      join aegis.knowledge_objects ko on ko.id = dd.dossier_id
      where dd.source_document_id = source_documents.id
        and ko.owner_platform = 'aegis'
        and ko.status = 'published'
        and ko.visibility = 'public'
    )
  );

drop policy if exists "public source pages are readable" on aegis.source_pages;
drop policy if exists "published Aegis source pages are public" on aegis.source_pages;
create policy "published Aegis source pages are public"
  on aegis.source_pages for select to anon, authenticated
  using (
    review_status <> 'redacted'
    and exists (
      select 1
      from aegis.source_documents sd
      join aegis.dossier_documents dd on dd.source_document_id = sd.id
      join aegis.knowledge_objects ko on ko.id = dd.dossier_id
      where sd.id = source_pages.source_document_id
        and sd.owner_platform = 'aegis'
        and sd.access_level = 'public'
        and ko.owner_platform = 'aegis'
        and ko.status = 'published'
        and ko.visibility = 'public'
    )
  );

drop policy if exists "published dossier documents are public" on aegis.dossier_documents;
drop policy if exists "published Aegis dossier documents are public" on aegis.dossier_documents;
create policy "published Aegis dossier documents are public"
  on aegis.dossier_documents for select to anon, authenticated
  using (
    exists (
      select 1 from aegis.knowledge_objects ko
      where ko.id = dossier_documents.dossier_id
        and ko.owner_platform = 'aegis'
        and ko.status = 'published'
        and ko.visibility = 'public'
    )
  );

drop policy if exists "public document sections are readable" on aegis.document_sections;
drop policy if exists "public platform document sections are readable" on aegis.document_sections;
create policy "public platform document sections are readable"
  on aegis.document_sections for select to anon, authenticated
  using (
    exists (
      select 1
      from aegis.source_documents sd
      join aegis.dossier_documents dd on dd.source_document_id = sd.id
      join aegis.knowledge_objects ko on ko.id = dd.dossier_id
      where sd.id = document_sections.source_document_id
        and sd.owner_platform = 'aegis'
        and sd.access_level = 'public'
        and ko.owner_platform = 'aegis'
        and ko.status = 'published'
        and ko.visibility = 'public'
    )
  );

update aegis.source_documents
set owner_platform = 'aegis',
metadata = metadata || jsonb_build_object(
  'owner_platform', 'aegis'
);

create or replace view public.aegis_dossier_documents
with (security_invoker = true)
as
select
  dd.dossier_id,
  ko.slug as dossier_slug,
  dd.source_document_id,
  sd.slug as document_slug,
  sd.title,
  sd.description,
  sd.mime_type,
  sd.imported_at,
  sd.metadata,
  dd.role,
  dd.position,
  (
    select count(*)::integer
    from aegis.source_pages sp
    where sp.source_document_id = sd.id
      and sp.review_status <> 'redacted'
  ) as page_count,
  (
    select count(*)::integer
    from aegis.document_sections ds
    where ds.source_document_id = sd.id
  ) as section_count
from aegis.dossier_documents dd
join aegis.knowledge_objects ko on ko.id = dd.dossier_id
join aegis.source_documents sd on sd.id = dd.source_document_id
where ko.owner_platform = 'aegis'
  and ko.status = 'published'
  and ko.visibility = 'public'
  and sd.owner_platform = 'aegis'
  and sd.access_level = 'public';

create or replace view public.aegis_document_sections
with (security_invoker = true)
as
select
  ds.id,
  ds.source_document_id,
  ds.stable_key,
  ds.title,
  ds.page_number,
  ds.level,
  ds.position,
  ds.tab_key,
  ds.metadata
from aegis.document_sections ds
join aegis.source_documents sd on sd.id = ds.source_document_id
where sd.owner_platform = 'aegis'
  and sd.access_level = 'public'
  and exists (
    select 1
    from aegis.dossier_documents dd
    join aegis.knowledge_objects ko on ko.id = dd.dossier_id
    where dd.source_document_id = sd.id
      and ko.owner_platform = 'aegis'
      and ko.status = 'published'
      and ko.visibility = 'public'
  );

create or replace view public.aegis_document_pages
with (security_invoker = true)
as
select
  sp.id,
  sp.source_document_id,
  sp.page_number,
  sp.extracted_text,
  sp.content_hash,
  sp.review_status
from aegis.source_pages sp
join aegis.source_documents sd on sd.id = sp.source_document_id
where sd.owner_platform = 'aegis'
  and sd.access_level = 'public'
  and sp.review_status <> 'redacted'
  and exists (
    select 1
    from aegis.dossier_documents dd
    join aegis.knowledge_objects ko on ko.id = dd.dossier_id
    where dd.source_document_id = sd.id
      and ko.owner_platform = 'aegis'
      and ko.status = 'published'
      and ko.visibility = 'public'
  );

grant select on aegis.source_documents, aegis.source_pages,
  aegis.dossier_documents, aegis.document_sections to anon, authenticated;

revoke all on public.aegis_dossier_documents, public.aegis_document_sections,
  public.aegis_document_pages from public, anon, authenticated;

grant select on public.aegis_dossier_documents, public.aegis_document_sections,
  public.aegis_document_pages to anon, authenticated;
