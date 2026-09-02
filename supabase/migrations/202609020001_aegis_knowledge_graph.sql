-- Aegis knowledge graph
-- Public reads are deliberately limited to published, public knowledge.

create schema if not exists aegis;

create table aegis.knowledge_objects (
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

create table aegis.dossiers (
  id uuid primary key references aegis.knowledge_objects(id) on delete cascade,
  eyebrow text,
  subtitle text,
  hero_image_url text,
  theme_tags text[] not null default '{}',
  current_phase text,
  featured boolean not null default false
);

create table aegis.source_documents (
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

create table aegis.source_pages (
  id uuid primary key default gen_random_uuid(),
  source_document_id uuid not null references aegis.source_documents(id) on delete cascade,
  page_number integer not null check (page_number > 0),
  extracted_text text not null,
  content_hash text not null,
  review_status text not null default 'unreviewed' check (review_status in ('unreviewed', 'reviewed', 'redacted')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (source_document_id, page_number)
);

create table aegis.content_blocks (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references aegis.knowledge_objects(id) on delete cascade,
  source_page_id uuid references aegis.source_pages(id) on delete set null,
  parent_id uuid references aegis.content_blocks(id) on delete cascade,
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

create table aegis.sources (
  id uuid primary key references aegis.knowledge_objects(id) on delete cascade,
  citation text not null,
  url text,
  publisher text,
  publication_date date,
  source_document_id uuid references aegis.source_documents(id) on delete set null,
  page_from integer,
  page_to integer,
  check (page_from is null or page_from > 0),
  check (page_to is null or page_to >= page_from)
);

create table aegis.claims (
  id uuid primary key references aegis.knowledge_objects(id) on delete cascade,
  dossier_id uuid not null references aegis.knowledge_objects(id) on delete cascade,
  content_block_id uuid references aegis.content_blocks(id) on delete set null,
  statement text not null,
  valid_from date,
  valid_to date,
  check (valid_to is null or valid_from is null or valid_to >= valid_from)
);

create table aegis.claim_sources (
  claim_id uuid not null references aegis.claims(id) on delete cascade,
  source_id uuid not null references aegis.sources(id) on delete cascade,
  support_type text not null check (support_type in ('supports', 'qualifies', 'contradicts', 'background')),
  note text,
  primary key (claim_id, source_id)
);

create table aegis.events (
  id uuid primary key references aegis.knowledge_objects(id) on delete cascade,
  dossier_id uuid references aegis.knowledge_objects(id) on delete cascade,
  event_date date,
  publication_date date,
  process_date date,
  legal_change_date date,
  location text,
  legal_status text,
  consequence text,
  uncertainty text
);

create table aegis.actors (
  id uuid primary key references aegis.knowledge_objects(id) on delete cascade,
  actor_type text,
  jurisdiction text
);

create table aegis.measurements (
  id uuid primary key references aegis.knowledge_objects(id) on delete cascade,
  dossier_id uuid references aegis.knowledge_objects(id) on delete cascade,
  numeric_value numeric,
  unit text,
  period_start date,
  period_end date,
  population text,
  method text,
  uncertainty text,
  check (period_end is null or period_start is null or period_end >= period_start)
);

create table aegis.legal_rules (
  id uuid primary key references aegis.knowledge_objects(id) on delete cascade,
  dossier_id uuid references aegis.knowledge_objects(id) on delete cascade,
  jurisdiction text,
  authority text,
  procedure text,
  limitations text,
  valid_from date,
  valid_to date,
  check (valid_to is null or valid_from is null or valid_to >= valid_from)
);

create table aegis.proposals (
  id uuid primary key references aegis.knowledge_objects(id) on delete cascade,
  dossier_id uuid references aegis.knowledge_objects(id) on delete cascade,
  value_basis text,
  instrument text,
  cost_text text,
  implementer text,
  deadline date,
  decision_status text
);

create table aegis.relations (
  id uuid primary key default gen_random_uuid(),
  from_object_id uuid not null references aegis.knowledge_objects(id) on delete cascade,
  to_object_id uuid not null references aegis.knowledge_objects(id) on delete cascade,
  relation_type text not null check (relation_type in (
    'contains', 'causes', 'depends_on', 'supports', 'contradicts',
    'contextualizes', 'substantiates', 'explains_rights', 'reflects_experience',
    'opens_dialogue', 'organizes', 'implements', 'updates'
  )),
  source_id uuid references aegis.sources(id) on delete set null,
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

create table aegis.aegora_links (
  id uuid primary key default gen_random_uuid(),
  aegis_object_id uuid not null references aegis.knowledge_objects(id) on delete cascade,
  aegora_topic_id text references public.aegora_topics(id) on delete restrict,
  aegora_right_id text references public.aegora_rights(id) on delete restrict,
  aegora_source_id uuid references public.aegora_sources(id) on delete restrict,
  aegora_route_id text references public.aegora_legal_routes(id) on delete restrict,
  relation_type text not null check (relation_type in (
    'topic_context', 'legal_basis', 'legal_route', 'source_basis', 'related_protection'
  )),
  status text not null default 'review' check (status in ('draft', 'review', 'published', 'archived')),
  note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (num_nonnulls(aegora_topic_id, aegora_right_id, aegora_source_id, aegora_route_id) = 1),
  check (jsonb_typeof(metadata) = 'object')
);

create unique index aegora_links_topic_unique_idx
  on aegis.aegora_links (aegis_object_id, aegora_topic_id, relation_type)
  where aegora_topic_id is not null;
create unique index aegora_links_right_unique_idx
  on aegis.aegora_links (aegis_object_id, aegora_right_id, relation_type)
  where aegora_right_id is not null;
create unique index aegora_links_source_unique_idx
  on aegis.aegora_links (aegis_object_id, aegora_source_id, relation_type)
  where aegora_source_id is not null;
create unique index aegora_links_route_unique_idx
  on aegis.aegora_links (aegis_object_id, aegora_route_id, relation_type)
  where aegora_route_id is not null;

create table aegis.public_cases (
  id uuid primary key references aegis.knowledge_objects(id) on delete cascade,
  dossier_id uuid references aegis.knowledge_objects(id) on delete cascade,
  publication_date date,
  event_date date,
  location text,
  known_facts text,
  legal_status text,
  consequence text,
  uncertainty text
);

create table aegis.public_case_events (
  id uuid primary key default gen_random_uuid(),
  public_case_id uuid not null references aegis.public_cases(id) on delete cascade,
  event_type text not null check (event_type in (
    'event', 'publication', 'report', 'investigation', 'prosecution',
    'hearing', 'demand', 'judgment', 'appeal', 'legal_change', 'correction'
  )),
  event_date date,
  description text not null,
  source_id uuid references aegis.sources(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table aegis.revisions (
  id uuid primary key default gen_random_uuid(),
  object_id uuid not null references aegis.knowledge_objects(id) on delete cascade,
  version integer not null check (version > 0),
  change_summary text not null,
  snapshot jsonb not null,
  editor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (object_id, version)
);

create table aegis.import_runs (
  id uuid primary key default gen_random_uuid(),
  source_document_id uuid references aegis.source_documents(id) on delete set null,
  status text not null check (status in ('started', 'completed', 'failed')),
  counters jsonb not null default '{}'::jsonb,
  error_message text,
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  check (jsonb_typeof(counters) = 'object')
);

create index knowledge_objects_public_idx
  on aegis.knowledge_objects (object_type, status, visibility, published_at desc);
create index knowledge_objects_platform_idx
  on aegis.knowledge_objects (owner_platform, object_type);
create index dossiers_theme_tags_idx on aegis.dossiers using gin (theme_tags);
create index content_blocks_dossier_position_idx on aegis.content_blocks (dossier_id, position);
create index content_blocks_source_page_idx on aegis.content_blocks (source_page_id);
create index content_blocks_parent_idx on aegis.content_blocks (parent_id) where parent_id is not null;
create index source_pages_document_page_idx on aegis.source_pages (source_document_id, page_number);
create index sources_document_idx on aegis.sources (source_document_id) where source_document_id is not null;
create index claims_dossier_idx on aegis.claims (dossier_id);
create index claims_content_block_idx on aegis.claims (content_block_id);
create index claim_sources_source_idx on aegis.claim_sources (source_id);
create index events_dossier_event_date_idx on aegis.events (dossier_id, event_date desc);
create index measurements_dossier_period_idx on aegis.measurements (dossier_id, period_start desc);
create index legal_rules_dossier_validity_idx on aegis.legal_rules (dossier_id, valid_from desc);
create index proposals_dossier_idx on aegis.proposals (dossier_id);
create index relations_from_idx on aegis.relations (from_object_id, relation_type);
create index relations_to_idx on aegis.relations (to_object_id, relation_type);
create index relations_source_idx on aegis.relations (source_id) where source_id is not null;
create index relations_published_from_idx on aegis.relations (from_object_id) where status = 'published';
create index relations_published_to_idx on aegis.relations (to_object_id) where status = 'published';
create index aegora_links_object_idx on aegis.aegora_links (aegis_object_id, status);
create index aegora_links_topic_idx on aegis.aegora_links (aegora_topic_id) where aegora_topic_id is not null;
create index aegora_links_right_idx on aegis.aegora_links (aegora_right_id) where aegora_right_id is not null;
create index aegora_links_source_idx on aegis.aegora_links (aegora_source_id) where aegora_source_id is not null;
create index aegora_links_route_idx on aegis.aegora_links (aegora_route_id) where aegora_route_id is not null;
create index public_cases_dates_idx on aegis.public_cases (event_date desc, publication_date desc);
create index public_cases_dossier_idx on aegis.public_cases (dossier_id) where dossier_id is not null;
create index public_case_events_case_date_idx on aegis.public_case_events (public_case_id, event_date);
create index public_case_events_source_idx on aegis.public_case_events (source_id) where source_id is not null;
create index revisions_object_version_idx on aegis.revisions (object_id, version desc);
create index revisions_editor_idx on aegis.revisions (editor_id) where editor_id is not null;
create index import_runs_document_idx on aegis.import_runs (source_document_id) where source_document_id is not null;
create index source_documents_public_idx on aegis.source_documents (slug) where access_level = 'public';

create function aegis.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger knowledge_objects_set_updated_at before update on aegis.knowledge_objects
  for each row execute function aegis.set_updated_at();
create trigger source_documents_set_updated_at before update on aegis.source_documents
  for each row execute function aegis.set_updated_at();
create trigger source_pages_set_updated_at before update on aegis.source_pages
  for each row execute function aegis.set_updated_at();
create trigger content_blocks_set_updated_at before update on aegis.content_blocks
  for each row execute function aegis.set_updated_at();
create trigger relations_set_updated_at before update on aegis.relations
  for each row execute function aegis.set_updated_at();
create trigger aegora_links_set_updated_at before update on aegis.aegora_links
  for each row execute function aegis.set_updated_at();

alter table aegis.knowledge_objects enable row level security;
alter table aegis.dossiers enable row level security;
alter table aegis.source_documents enable row level security;
alter table aegis.source_pages enable row level security;
alter table aegis.content_blocks enable row level security;
alter table aegis.sources enable row level security;
alter table aegis.claims enable row level security;
alter table aegis.claim_sources enable row level security;
alter table aegis.events enable row level security;
alter table aegis.actors enable row level security;
alter table aegis.measurements enable row level security;
alter table aegis.legal_rules enable row level security;
alter table aegis.proposals enable row level security;
alter table aegis.relations enable row level security;
alter table aegis.aegora_links enable row level security;
alter table aegis.public_cases enable row level security;
alter table aegis.public_case_events enable row level security;
alter table aegis.revisions enable row level security;
alter table aegis.import_runs enable row level security;

create policy "published knowledge is public"
  on aegis.knowledge_objects for select to anon, authenticated
  using (status = 'published' and visibility = 'public');

create policy "published dossiers are public"
  on aegis.dossiers for select to anon, authenticated
  using (exists (
    select 1 from aegis.knowledge_objects ko
    where ko.id = dossiers.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "public source documents are readable"
  on aegis.source_documents for select to anon, authenticated
  using (access_level = 'public');

create policy "public source pages are readable"
  on aegis.source_pages for select to anon, authenticated
  using (exists (
    select 1 from aegis.source_documents sd
    where sd.id = source_pages.source_document_id and sd.access_level = 'public'
  ));

create policy "published dossier blocks are public"
  on aegis.content_blocks for select to anon, authenticated
  using (exists (
    select 1 from aegis.knowledge_objects ko
    where ko.id = content_blocks.dossier_id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published sources are public"
  on aegis.sources for select to anon, authenticated
  using (exists (
    select 1 from aegis.knowledge_objects ko
    where ko.id = sources.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published claims are public"
  on aegis.claims for select to anon, authenticated
  using (exists (
    select 1 from aegis.knowledge_objects ko
    where ko.id = claims.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published claim links are public"
  on aegis.claim_sources for select to anon, authenticated
  using (
    exists (
      select 1 from aegis.knowledge_objects ko
      where ko.id = claim_sources.claim_id and ko.status = 'published' and ko.visibility = 'public'
    )
    and exists (
      select 1 from aegis.knowledge_objects ko
      where ko.id = claim_sources.source_id and ko.status = 'published' and ko.visibility = 'public'
    )
  );

create policy "published events are public"
  on aegis.events for select to anon, authenticated
  using (exists (
    select 1 from aegis.knowledge_objects ko
    where ko.id = events.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published actors are public"
  on aegis.actors for select to anon, authenticated
  using (exists (
    select 1 from aegis.knowledge_objects ko
    where ko.id = actors.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published measurements are public"
  on aegis.measurements for select to anon, authenticated
  using (exists (
    select 1 from aegis.knowledge_objects ko
    where ko.id = measurements.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published legal rules are public"
  on aegis.legal_rules for select to anon, authenticated
  using (exists (
    select 1 from aegis.knowledge_objects ko
    where ko.id = legal_rules.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published proposals are public"
  on aegis.proposals for select to anon, authenticated
  using (exists (
    select 1 from aegis.knowledge_objects ko
    where ko.id = proposals.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published relations are public"
  on aegis.relations for select to anon, authenticated
  using (
    status = 'published'
    and exists (
      select 1 from aegis.knowledge_objects ko
      where ko.id = relations.from_object_id and ko.status = 'published' and ko.visibility = 'public'
    )
    and exists (
      select 1 from aegis.knowledge_objects ko
      where ko.id = relations.to_object_id and ko.status = 'published' and ko.visibility = 'public'
    )
  );

create policy "published Aegora links are public"
  on aegis.aegora_links for select to anon, authenticated
  using (
    status = 'published'
    and exists (
      select 1 from aegis.knowledge_objects ko
      where ko.id = aegora_links.aegis_object_id
        and ko.status = 'published'
        and ko.visibility = 'public'
    )
    and (
      (aegora_topic_id is not null and exists (
        select 1 from public.aegora_topics at
        where at.id = aegora_links.aegora_topic_id and at.is_public = true
      ))
      or (aegora_right_id is not null and exists (
        select 1 from public.aegora_rights ar
        where ar.id = aegora_links.aegora_right_id and ar.status = 'published'
      ))
      or (aegora_source_id is not null and exists (
        select 1 from public.aegora_sources aso
        where aso.id = aegora_links.aegora_source_id and aso.status = 'published'
      ))
      or (aegora_route_id is not null and exists (
        select 1 from public.aegora_legal_routes alr
        where alr.id = aegora_links.aegora_route_id and alr.is_active = true
      ))
    )
  );

create policy "published public cases are public"
  on aegis.public_cases for select to anon, authenticated
  using (exists (
    select 1 from aegis.knowledge_objects ko
    where ko.id = public_cases.id and ko.status = 'published' and ko.visibility = 'public'
  ));

create policy "published case events are public"
  on aegis.public_case_events for select to anon, authenticated
  using (exists (
    select 1
    from aegis.public_cases pc
    join aegis.knowledge_objects ko on ko.id = pc.id
    where pc.id = public_case_events.public_case_id
      and ko.status = 'published'
      and ko.visibility = 'public'
  ));

grant usage on schema aegis to anon, authenticated, service_role;
grant select on aegis.knowledge_objects, aegis.dossiers, aegis.source_documents,
  aegis.source_pages, aegis.content_blocks, aegis.sources, aegis.claims,
  aegis.claim_sources, aegis.events, aegis.actors, aegis.measurements,
  aegis.legal_rules, aegis.proposals, aegis.relations, aegis.aegora_links, aegis.public_cases,
  aegis.public_case_events to anon, authenticated;

grant all on all tables in schema aegis to service_role;
alter default privileges for role postgres in schema aegis
  grant all on tables to service_role;
revoke execute on function aegis.set_updated_at() from public, anon, authenticated;
grant execute on function aegis.set_updated_at() to service_role;

create view aegis.published_dossiers
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
    from aegis.relations r
    where r.status = 'published'
      and (r.from_object_id = ko.id or r.to_object_id = ko.id)
  ) as relation_count
from aegis.knowledge_objects ko
join aegis.dossiers d on d.id = ko.id
where ko.object_type = 'dossier'
  and ko.status = 'published'
  and ko.visibility = 'public';

grant select on aegis.published_dossiers to anon, authenticated;

-- Public API views keep the tables isolated in the Aegis schema while allowing
-- the existing public Data API to serve only RLS-approved records.
create view public.aegis_published_dossiers
with (security_invoker = true)
as select * from aegis.published_dossiers;

create view public.aegis_content_blocks
with (security_invoker = true)
as select * from aegis.content_blocks;

create view public.aegis_claims
with (security_invoker = true)
as select * from aegis.claims;

create view public.aegis_knowledge_objects
with (security_invoker = true)
as select * from aegis.knowledge_objects;

create view public.aegis_aegora_connections
with (security_invoker = true)
as
select
  al.id,
  al.aegis_object_id,
  al.relation_type,
  case
    when al.aegora_topic_id is not null then 'topic'
    when al.aegora_right_id is not null then 'right'
    when al.aegora_source_id is not null then 'source'
    else 'route'
  end as aegora_entity_type,
  coalesce(al.aegora_topic_id, al.aegora_right_id, al.aegora_source_id::text, al.aegora_route_id) as aegora_entity_id,
  coalesce(at.label, ar.title, aso.title, alr.label) as aegora_title,
  al.note,
  al.metadata,
  al.updated_at
from aegis.aegora_links al
left join public.aegora_topics at on at.id = al.aegora_topic_id
left join public.aegora_rights ar on ar.id = al.aegora_right_id
left join public.aegora_sources aso on aso.id = al.aegora_source_id
left join public.aegora_legal_routes alr on alr.id = al.aegora_route_id;

grant select on public.aegis_published_dossiers, public.aegis_content_blocks,
  public.aegis_claims, public.aegis_knowledge_objects,
  public.aegis_aegora_connections to anon, authenticated, service_role;
