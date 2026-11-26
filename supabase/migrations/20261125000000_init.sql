-- Invitely tables. Times are milliseconds since 1970.

create table invitations (
  id text primary key,
  slug text not null unique,
  occasion text not null,
  title text not null,
  status text not null default 'draft',
  plan text not null default 'free',
  data text not null,
  views integer not null default 0,
  created_at bigint not null,
  updated_at bigint not null,
  published_at bigint,
  manage_token text not null unique,
  owner_name text not null default '',
  owner_contact text not null default '',
  pin_hash text not null default '',
  pin_fails integer not null default 0,
  pin_locked_until bigint not null default 0,
  review_status text not null default 'none',
  confirmed_at bigint
);

create table guests (
  id text primary key,
  invitation_id text not null references invitations(id) on delete cascade,
  name text not null,
  seats integer not null default 1,
  token text not null unique,
  table_name text not null default '',
  phone text not null default '',
  opened_at bigint,
  checked_in_at bigint,
  created_at bigint not null
);
create index guests_invitation on guests(invitation_id);

create table rsvps (
  id text primary key,
  invitation_id text not null references invitations(id) on delete cascade,
  guest_id text references guests(id) on delete set null,
  name text not null,
  phone text not null default '',
  attending integer not null,
  party_size integer not null default 1,
  meal text not null default '',
  answer text not null default '',
  message text not null default '',
  hidden integer not null default 0,
  created_at bigint not null,
  updated_at bigint not null
);
create index rsvps_invitation on rsvps(invitation_id);
create index rsvps_guest on rsvps(guest_id);

create table reviews (
  id text primary key,
  invitation_id text not null references invitations(id) on delete cascade,
  round integer not null,
  status text not null default 'open',
  note text not null default '',
  pins text not null default '[]',
  reply text not null default '',
  created_at bigint not null,
  updated_at bigint not null
);
create index reviews_invitation on reviews(invitation_id);

create table likes (
  design text primary key,
  count integer not null default 0
);

create table rate_limits (
  key text primary key,
  window_start bigint not null,
  count integer not null
);

-- These rows hold manage links, PIN hashes and phone numbers. Only the server,
-- which connects as the table owner, may read them. No policies means no access
-- through Supabase's public Data API.
alter table invitations enable row level security;
alter table guests enable row level security;
alter table rsvps enable row level security;
alter table reviews enable row level security;
alter table likes enable row level security;
alter table rate_limits enable row level security;

do $$
declare r text;
begin
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke all on invitations, guests, rsvps, reviews, likes, rate_limits from %I', r);
    end if;
  end loop;

  -- Photos. Anyone with a photo's address can see it. Only signed uploads can add one.
  if to_regclass('storage.buckets') is not null then
    execute $q$
      insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      values ('photos', 'photos', true, 1500000, array['image/jpeg', 'image/png', 'image/webp'])
      on conflict (id) do nothing
    $q$;
  end if;
end $$;
