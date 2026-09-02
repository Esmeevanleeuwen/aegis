-- Curated public starting point. Raw PDF pages are imported separately and remain internal.

insert into public.knowledge_objects (
  object_type, slug, title, summary, status, visibility, owner_platform,
  published_at, last_checked_at, metadata
)
values (
  'dossier',
  'de-uitgang-is-vol',
  'De uitgang is vol',
  'Waarom systemen vastlopen wanneer mensen nergens duurzaam naartoe kunnen.',
  'published',
  'public',
  'aegis',
  timezone('utc', now()),
  timezone('utc', now()),
  '{"editorial_origin":"curated_seed"}'::jsonb
)
on conflict (object_type, slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  status = excluded.status,
  visibility = excluded.visibility,
  published_at = excluded.published_at,
  last_checked_at = excluded.last_checked_at,
  metadata = excluded.metadata;

insert into public.dossiers (id, eyebrow, subtitle, theme_tags, current_phase, featured)
select
  id,
  'Dossier · wonen en zorg',
  'Woningtekorten blokkeren zorg, veiligheid en zelfstandigheid.',
  array['Wonen', 'Zorg', 'Bestuur', 'Veiligheid'],
  'Gepubliceerd',
  true
from public.knowledge_objects
where object_type = 'dossier' and slug = 'de-uitgang-is-vol'
on conflict (id) do update set
  eyebrow = excluded.eyebrow,
  subtitle = excluded.subtitle,
  theme_tags = excluded.theme_tags,
  current_phase = excluded.current_phase,
  featured = excluded.featured;

with dossier as (
  select id from public.knowledge_objects
  where object_type = 'dossier' and slug = 'de-uitgang-is-vol'
), blocks(stable_key, block_type, eyebrow, heading, body, position, metadata) as (
  values
    ('chain-01', 'causal_step', null, 'Geen passende woning', 'Mensen kunnen niet veilig of zelfstandig uitstromen.', 1, '{"number":"01"}'::jsonb),
    ('chain-02', 'causal_step', null, 'Geen uitstroom', 'Een zware voorziening blijft bezet nadat de directe behandeling is afgerond.', 2, '{"number":"02"}'::jsonb),
    ('chain-03', 'causal_step', null, 'Nieuwe instroom wacht', 'De ontbrekende vervolgplek veroorzaakt schaarste aan de ingang.', 3, '{"number":"03"}'::jsonb),
    ('chain-04', 'causal_step', null, 'Schade groeit', 'Gezondheid, relaties en zelfstandigheid verslechteren tijdens het wachten.', 4, '{"number":"04"}'::jsonb),
    ('chain-05', 'causal_step', null, 'Druk verschuift', 'Gezinnen, gemeenten, politie en crisiszorg vangen de gevolgen op.', 5, '{"number":"05"}'::jsonb),
    ('overzicht', 'summary', 'De kern', 'Veel systemen lopen niet vast bij de ingang, maar bij de uitgang.', 'Een patiënt kan uitbehandeld zijn, een statushouder kan een verblijfsvergunning hebben en een jongere kan klaar zijn voor een volgende plek. Zolang passende huisvesting, vervolgzorg of begeleiding ontbreekt, blijft de eerdere voorziening bezet.\n\nDaardoor ontstaat een keten die in verschillende beleidsvelden een andere naam krijgt, maar dezelfde materiële oorzaak kan hebben.', 10, '{"section_id":"overzicht","label":"Overzicht"}'::jsonb),
    ('data', 'body', 'Wat wordt gemeten', 'Niet alleen de wachtrij, maar ook de geblokkeerde uitstroom telt.', 'De datalaag onderscheidt capaciteit, bezetting, uitstroom, wachttijd en de plaats waar de gevolgen terechtkomen. Een cijfer krijgt altijd een periode, populatie, methode, bron en onzekerheidsnotitie.', 20, '{"section_id":"data","label":"Data"}'::jsonb),
    ('tijdlijn', 'body', 'Verandering door de tijd', 'Verschillende datums blijven afzonderlijk zichtbaar.', 'Gebeurtenisdatum, publicatiedatum, procesdatum en juridische wijzigingsdatum worden niet tot één datum samengevoegd. Revisies tonen wat wanneer bekend was.', 30, '{"section_id":"tijdlijn","label":"Tijdlijn"}'::jsonb),
    ('netwerk', 'context', 'Gedeelde kennis', 'Eén bevinding kan meerdere platformfuncties voeden.', 'Meridian levert context, Phosphoros controleert bewijs, Aegora beschrijft rechten, AVERA brengt ervaringen in beeld, Civiora opent dialoog en Ampara organiseert bescherming.', 40, '{"section_id":"netwerk","label":"Netwerk"}'::jsonb),
    ('rechten', 'body', 'De uitvoeringslaag', 'Een toegekend recht is nog geen feitelijke bescherming.', 'De rechtslaag onderscheidt afwezig recht, betwist recht en bestaand maar niet uitgevoerd recht. Bevoegde instantie, route, geldigheid en uitvoeringsproblemen blijven zichtbaar.', 50, '{"section_id":"rechten","label":"Rechten"}'::jsonb),
    ('voorstellen', 'body', 'Van analyse naar keuze', 'Een voorstel noemt wie handelt, wat het kost en wanneer het toetsbaar wordt.', 'Waarden, instrument, uitvoerder, kosten, termijn en besluitstatus blijven afzonderlijke velden. Zo blijft zichtbaar waar analyse eindigt en een politieke keuze begint.', 60, '{"section_id":"voorstellen","label":"Voorstellen"}'::jsonb),
    ('bronnen', 'body', 'Herkomst en controle', 'Iedere publieke conclusie blijft terug te voeren op een bron.', 'Bronpagina’s blijven intern tot zij zijn gecontroleerd. Gepubliceerde claims verwijzen naar specifieke bronnen en tonen bewijsstatus, geldigheidsperiode en laatste controle.', 70, '{"section_id":"bronnen","label":"Bronnen"}'::jsonb)
)
insert into public.content_blocks (
  dossier_id, stable_key, block_type, eyebrow, heading, body, position, metadata
)
select dossier.id, blocks.stable_key, blocks.block_type, blocks.eyebrow,
  blocks.heading, blocks.body, blocks.position, blocks.metadata
from dossier cross join blocks
on conflict (dossier_id, stable_key) do update set
  block_type = excluded.block_type,
  eyebrow = excluded.eyebrow,
  heading = excluded.heading,
  body = excluded.body,
  position = excluded.position,
  metadata = excluded.metadata;
