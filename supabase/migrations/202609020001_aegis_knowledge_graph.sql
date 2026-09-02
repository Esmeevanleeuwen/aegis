-- Aegis knowledge graph
-- Public reads are deliberately limited to published, public knowledge.

create table public.knowledge_objects (
  id uuid primary key default gen_random_uuid(),
  object_type text not null check (object_type in (
    'dossier', 'chapter', 'claim', 'source', 'event', 'actor',
    'measurement', 'legal_rule', 'proposal', 'public_case', 'dataset'
  )),
  slug text not null,
  title text not null,
  summary text,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  visibility text not null default 'internal' check (visibility in ('private', 'internal', 'public')),
  evidence_status text check (evidence_status in (
    'established', 'probable', 'disputed', 'unknown', 'political_choice'
  )),
  owner_platform text not null default 'aegis' check (owner_platform in (
    'aegis', 'meridian', 'phosphoros', 'aegora', 'avera', 'civiora', 'ampara'
  )),
  metadata jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  last_checked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (object_type, slug),
  check (jsonb_typeof(metadata) = 'object')
);

create table public.dossiers (
  id uuid primary key references public.knowledge_objects(id) on delete cascade,
  eyebrow text,
  subtitle text,
  hero_image_url text,
  theme_tags text[] not null default '{}',
  current_phase text,
  featured boolean not null default false
);

create table public.source_documents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  file_name text not null,
  mime_type text not null default 'application/pdf',
  checksum text not null,
  access_level text not null default 'internal' check (access_level in ('private', 'internal', 'public')),
  imported_at timestamptz not null default timezone('utc', now()),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (jsonb_typeof(metadata) = 'object')
);

create table public.source_pages (
  id uuid primary key default gen_random_uuid(),
  source_document_id uuid not null references public.source_documents(id) on delete cascade,
  page_number integer not null check (page_number > 0),
  extracted_text text not null,
  content_hash text not null,
  review_status text not null default 'unreviewed' check (review_status in ('unreviewed', 'reviewed', 'redacted')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (source_document_id, page_number)
);

create table public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.knowledge_objects(id) on delete cascade,
  source_page_id uuid references public.source_pages(id) on delete set null,
  parent_id uuid references public.content_blocks(id) on delete cascade,
  stable_key text not null,
  block_type text not null check (block_type in (
    'summary', 'body', 'causal_step', 'quote', 'statistic', 'context', 'callout', 'source_page'
  )),
  eyebrow text,
  heading text,
  body text,
  position integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (dossier_id, stable_key),
  check (jsonb_typeof(metadata) = 'object')
);

create table public.sources (
  id uuid primary key references public.knowledge_objects(id) on delete cascade,
  citation text not null,
  url text,
  publisher text,
  publication_date date,
  source_document_id uuid references public.source_documents(id) on delete set null,
  page_from integer,
  page_to integer,
  check (page_from is null or page_from > 0),
  check (page_to is null or page_to >= page_from)
);

create table public.claims (
  id uuid primary key references public.knowledge_objects(id) on delete cascade,
  dossier_id uuid not null references public.knowledge_objects(id) on delete cascade,
  content_block_id uuid references public.content_blocks(id) on delete set null,
  statement text not null,
  valid_from date,
  valid_to date,
  check (valid_to is null or valid_from is null or valid_to >= valid_from)
);

create table public.claim_sources (
  claim_id uuid not null references public.claims(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  support_type text not null check (support_type in ('supports', 'qualifies', 'contradicts', 'background')),
  note text,
  primary key (claim_id, source_id)
);

create table public.events (
  id uuid primary key references public.knowledge_objects(id) on delete cascade,
  dossier_id uuid references public.knowledge_objects(id) on delete cascade,
  event_date date,
  publication_date date,
  process_date date,
  legal_change_date date,
  location text,
  legal_status text,
  consequence text,
  uncertainty text
);

create table public.actors (
  id uuid primary key references public.knowledge_objects(id) on delete cascade,
  actor_type text,
  jurisdiction text
);

create table public.measurements (
  id uuid primary key references public.knowledge_objects(id) on delete cascade,
  dossier_id uuid references public.knowledge_objects(id) on delete cascade,
  numeric_value numeric,
  unit text,
  period_start date,
  period_end date,
  population text,
  method text,
  uncertainty text,
  check (period_end is null or period_start is null or period_end >= period_start)
);

create table public.legal_rules (
  id uuid primary key references public.knowledge_objects(id) on delete cascade,
  dossier_id uuid references public.knowledge_objects(id) on delete cascade,
  jurisdiction text,
  authority text,
  procedure text,
  limitations text,
  valid_from date,
  valid_to date,
  check (valid_to is null or valid_from is null or valid_to >= valid_from)
);

create table public.proposals (
  id uuid primary key references public.knowledge_objects(id) on delete cascade,
  dossier_id uuid references public.knowledge_objects(id) on delete cascade,
  value_basis text,
  instrument text,
  cost_text text,
  implementer text,
  deadline date,
  decision_status text
);

create table public.relations (
  id uuid primary key default gen_random_uuid(),
  from_object_id uuid not null references public.knowledge_objects(id) on delete cascade,
  to_object_id uuid not null references public.knowledge_objects(id) on delete cascade,
  relation_type text not null check (relation_type in (
    'contains', 'causes', 'depends_on', 'supports', 'contradicts',
    'contextualizes', 'substantiates', 'explains_rights', 'reflects_experience',
    'opens_dialogue', 'organizes', 'implements', 'updates'
  )),
  source_id uuid references public.sources(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  weight numeric,
  valid_from date,
  valid_to date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (from_object_id, to_object_id, relation_type),
  check (from_object_id <> to_object_id),
  check (valid_to is null or valid_from is null or valid_to >= valid_from)
);

create table public.public_cases (
  id uuid primary key references public.knowledge_objects(id) on delete cascade,
  dossier_id uuid references public.knowledge_objects(id) on delete cascade,
  publication_date date,
  event_date date,
  location text,
  known_facts text,
  legal_status text,
  consequence text,
  uncertainty text
);

create table public.public_case_events (
  id uuid primary key default gen_random_uuid(),
  public_case_id uuid not null references public.public_cases(id) on delete cascade,
  event_type text not null check (event_type in (
    'event', 'publication', 'report', 'investigation', 'prosecution',
    'hearing', 'demand', 'judgment', 'appeal', 'legal_change', 'correction'
  )),
  event_date date,
  description text not null,
  source_id uuid references public.sources(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.revisions (
  id uuid primary key default gen_random_uuid(),
  object_id uuid not null references public.knowledge_objects(id) on delete cascade,
  version integer not null check (version > 0),
  change_summary text not null,
  snapshot jsonb not null,
  editor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (object_id, version)
);

create table public.import_runs (
  id uuid primary key default gen_random_uuid(),
  source_document_id uuid references public.source_documents(id) on delete set null,
  status text not null check (status in ('started', 'completed', 'failed')),
  counters jsonb not null default '{}'::jsonb,
  error_message text,
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  check (jsonb_typeof(counters) = 'object')
);

create index knowledge_objects_public_idx
  on public.knowledge_objects (object_type, status, visibility, published_at desc);
create index knowledge_objects_platform_idx
  on public.knowledge_objects (owner_platform, object_type);
create index dossiers_theme_tags_idx on public.dossiers using gin (theme_tags);
create index content_blocks_dossier_position_idx on public.content_blocks (dossier_id, position);
create index content_blocks_source_page_idx on public.content_blocks (source_page_id);
create index source_pages_document_page_idx on public.source_pages (source_document_id, page_number);
create index claims_dossier_idx on public.claims (dossier_id);
create index claims_content_block_idx on public.claims (content_block_id);
create index claim_sources_source_idx on public.claim_sources (source_id);
create index events_dossier_event_date_idx on public.events (dossier_id, event_date desc);
create index measurements_dossier_period_idx on public.measurements (dossier_id, period_start desc);
create index legal_rules_dossier_validity_idx on public.legal_rules (dossier_id, valid_from desc);
create index proposals_dossier_idx on public.proposals (dossier_id);
create index relations_from_idx on public.relations (from_object_id, relation_type);
create index relations_to_idx on public.relations (to_object_id, relation_type);
create index public_cases_dates_idx on public.public_cases (event_date desc, publication_date desc);
create index public_case_events_case_date_idx on public.public_case_events (public_case_id, event_date);
create index revisions_object_version_idx on public.revisions (object_id, version desc);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger knowledge_objects_set_updated_at before update on public.knowledge_objects
  for each row execute function public.set_updated_at();
create trigger source_documents_set_updated_at before update on public.source_documents
  for each row execute function public.set_updated_at();
create trigger source_pages_set_updated_at before update on public.source_pages
  for each row execute function public.set_updated_at();
create trigger content_blocks_set_updated_at before update on public.content_blocks
  for each row execute function public.set_updated_at();
create trigger relations_set_updated_at before update on public.relations
  for each row execute function public.set_updated_at();

alter table public.knowledge_objects enable row level security;
alter table public.dossiers enable row level security;
alter table public.source_documents enable row level security;
alter table public.source_pages enable row level security;
alter table public.content_blocks enable row level security;
alter table public.sources enable row level security;
alter table public.claims enable row level security;
alter table public.claim_sources enable row level security;
alter table public.events enable row level security;
alter table public.actors enable row level security;
alter table public.measurements enable row level security;
alter table public.legal_rules enable row level security;
alter table public.proposals enable row level security;
alter table public.relations enable row level security;
alter table public.public_cases enable row level security;
alter table public.public_case_events enable row level security;
alter table public.revisions enable row level security;
alter table public.import_runs enable row level security;

create policy "published knowledge is public"
  on public.knowledge_objects for select to anon, authenticated
  using (status = 'published' and visibility = 'public');

create policy "published dossiers are public"
  on public.dossiers for select to anon, authenticated
  using (exists (
    select 1 from public.knowledge_objects ko
    where ko.id = dossiers.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "public source documents are readable"
  on public.source_documents for select to anon, authenticated
  using (access_level = 'public');

create policy "public source pages are readable"
  on public.source_pages for select to anon, authenticated
  using (exists (
    select 1 from public.source_documents sd
    where sd.id = source_pages.source_document_id and sd.access_level = 'public'
  ));

create policy "published dossier blocks are public"
  on public.content_blocks for select to anon, authenticated
  using (exists (
    select 1 from public.knowledge_objects ko
    where ko.id = content_blocks.dossier_id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published sources are public"
  on public.sources for select to anon, authenticated
  using (exists (
    select 1 from public.knowledge_objects ko
    where ko.id = sources.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published claims are public"
  on public.claims for select to anon, authenticated
  using (exists (
    select 1 from public.knowledge_objects ko
    where ko.id = claims.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published claim links are public"
  on public.claim_sources for select to anon, authenticated
  using (
    exists (
      select 1 from public.knowledge_objects ko
      where ko.id = claim_sources.claim_id and ko.status = 'published' and ko.visibility = 'public'
    )
    and exists (
      select 1 from public.knowledge_objects ko
      where ko.id = claim_sources.source_id and ko.status = 'published' and ko.visibility = 'public'
    )
  );

create policy "published events are public"
  on public.events for select to anon, authenticated
  using (exists (
    select 1 from public.knowledge_objects ko
    where ko.id = events.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published actors are public"
  on public.actors for select to anon, authenticated
  using (exists (
    select 1 from public.knowledge_objects ko
    where ko.id = actors.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published measurements are public"
  on public.measurements for select to anon, authenticated
  using (exists (
    select 1 from public.knowledge_objects ko
    where ko.id = measurements.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published legal rules are public"
  on public.legal_rules for select to anon, authenticated
  using (exists (
    select 1 from public.knowledge_objects ko
    where ko.id = legal_rules.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published proposals are public"
  on public.proposals for select to anon, authenticated
  using (exists (
    select 1 from public.knowledge_objects ko
    where ko.id = proposals.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published relations are public"
  on public.relations for select to anon, authenticated
  using (
    status = 'published'
    and exists (
      select 1 from public.knowledge_objects ko
      where ko.id = relations.from_object_id and ko.status = 'published' and ko.visibility = 'public'
    )
    and exists (
      select 1 from public.knowledge_objects ko
      where ko.id = relations.to_object_id and ko.status = 'published' and ko.visibility = 'public'
    )
  );

create policy "published public cases are public"
  on public.public_cases for select to anon, authenticated
  using (exists (
    select 1 from public.knowledge_objects ko
    where ko.id = public_cases.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published case events are public"
  on public.public_case_events for select to anon, authenticated
  using (exists (
    select 1
    from public.public_cases pc
    join public.knowledge_objects ko on ko.id = pc.id
    where pc.id = public_case_events.public_case_id
      and ko.status = 'published'
      and ko.visibility = 'public'
  ));

grant usage on schema public to anon, authenticated;
grant select on public.knowledge_objects, public.dossiers, public.source_documents,
  public.source_pages, public.content_blocks, public.sources, public.claims,
  public.claim_sources, public.events, public.actors, public.measurements,
  public.legal_rules, public.proposals, public.relations, public.public_cases,
  public.public_case_events to anon, authenticated;

grant all on all tables in schema public to service_role;
grant execute on function public.set_updated_at() to service_role;

create view public.published_dossiers
with (security_invoker = true)
as
select
  ko.id,
  ko.slug,
  ko.title,
  ko.summary,
  ko.status,
  ko.visibility,
  ko.last_checked_at,
  ko.updated_at,
  d.eyebrow,
  d.subtitle,
  d.hero_image_url,
  d.theme_tags,
  d.current_phase,
  d.featured,
  (
    select count(*)::integer
    from public.relations r
    where r.status = 'published'
      and (r.from_object_id = ko.id or r.to_object_id = ko.id)
  ) as relation_count
from public.knowledge_objects ko
join public.dossiers d on d.id = ko.id
where ko.object_type = 'dossier'
  and ko.status = 'published'
  and ko.visibility = 'public';

grant select on public.published_dossiers to anon, authenticated;
