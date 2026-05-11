create table merchants (
  id text primary key,
  display_name text not null,
  category text not null,
  status text not null check (status in ('pending_review', 'active', 'paused', 'rejected')),
  created_at timestamptz not null default now()
);

create table merchant_locations (
  id text primary key,
  merchant_id text not null references merchants(id) on delete cascade,
  display_name text not null,
  city text not null,
  region text not null,
  latitude numeric(9, 6) not null,
  longitude numeric(9, 6) not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table offers (
  id text primary key,
  merchant_id text not null references merchants(id) on delete cascade,
  title text not null,
  points_cost integer not null check (points_cost > 0),
  reward_value_cents integer not null check (reward_value_cents >= 0),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null check (status in ('draft', 'active', 'expired', 'paused')),
  check (ends_at > starts_at)
);

create table customer_wallets (
  id text primary key,
  customer_id text not null,
  merchant_id text not null references merchants(id) on delete cascade,
  points_balance integer not null default 0 check (points_balance >= 0),
  updated_at timestamptz not null default now(),
  unique (customer_id, merchant_id)
);

create table wallet_events (
  id text primary key,
  wallet_id text not null references customer_wallets(id) on delete cascade,
  event_type text not null check (event_type in ('earned', 'redeemed', 'adjusted', 'expired')),
  points_delta integer not null,
  reference_type text not null,
  reference_id text not null,
  created_at timestamptz not null default now()
);

create table redemptions (
  id text primary key,
  wallet_id text not null references customer_wallets(id) on delete restrict,
  offer_id text not null references offers(id) on delete restrict,
  status text not null check (status in ('created', 'presented', 'verified', 'redeemed', 'expired', 'rejected')),
  points_cost integer not null check (points_cost > 0),
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table pos_transaction_events (
  id text primary key,
  merchant_id text not null references merchants(id) on delete cascade,
  provider text not null check (provider in ('clover', 'square')),
  external_transaction_id text not null,
  amount_cents integer not null check (amount_cents >= 0),
  currency char(3) not null default 'USD',
  status text not null check (status in ('pending', 'paid', 'failed')),
  idempotency_key text not null unique,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index idx_merchant_locations_merchant_id on merchant_locations(merchant_id);
create index idx_offers_active_window on offers(merchant_id, status, starts_at, ends_at);
create index idx_customer_wallets_customer on customer_wallets(customer_id);
create index idx_wallet_events_wallet_created on wallet_events(wallet_id, created_at desc);
create index idx_redemptions_wallet_status on redemptions(wallet_id, status, created_at desc);
create index idx_pos_transaction_events_merchant_time on pos_transaction_events(merchant_id, occurred_at desc);

