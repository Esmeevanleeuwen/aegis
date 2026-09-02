-- Break the circular dependency while retaining both publication checks.
-- Dossier links verify the dossier; source documents verify their public link.

drop policy if exists "published Aegis dossier documents are public"
  on aegis.dossier_documents;
create policy "published Aegis dossier documents are public"
  on aegis.dossier_documents for select to anon, authenticated
  using (
    exists (
      select 1
      from aegis.knowledge_objects ko
      where ko.id = dossier_documents.dossier_id
        and ko.owner_platform = 'aegis'
        and ko.status = 'published'
        and ko.visibility = 'public'
    )
  );

drop policy if exists "published Aegis source documents are public"
  on aegis.source_documents;
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

drop policy if exists "published Aegis source pages are public"
  on aegis.source_pages;
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

drop policy if exists "public platform document sections are readable"
  on aegis.document_sections;
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
