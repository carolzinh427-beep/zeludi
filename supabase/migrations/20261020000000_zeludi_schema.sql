-- ====================================================================
-- ZELUDI PLATFORM — DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Comprehensive production-grade schema for pet care, health & management
-- ====================================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  role text not null default 'tutor' check (role in ('tutor', 'caregiver', 'business_admin', 'super_admin')),
  city text,
  state text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  terms_accepted_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. PETS (Multi-species central registry)
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  species text not null check (species in ('dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea_pig', 'ferret', 'reptile', 'other')),
  species_custom text,
  breed text,
  is_mixed_breed boolean not null default false,
  birth_date date,
  approximate_age_months integer,
  sex text check (sex in ('male', 'female', 'unknown')),
  is_neutered boolean default false,
  weight_kg numeric(6, 2),
  size_category text check (size_category in ('mini', 'small', 'medium', 'large', 'giant')),
  coat_type text check (coat_type in ('hairless', 'short', 'medium', 'long', 'curly', 'double_coat', 'feathers', 'scales', 'other')),
  coat_color text,
  current_diet text,
  dietary_restrictions text,
  allergies text,
  health_conditions text,
  prescribed_medications text,
  reference_vet_name text,
  reference_vet_phone text,
  reference_vet_clinic text,
  microchip_number text,
  photo_url text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. PET HEALTH RECORDS (Consultations, exams, surgeries)
create table if not exists public.pet_health_records (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  record_type text not null check (record_type in ('consultation', 'exam', 'surgery', 'weight_check', 'incident', 'other')),
  title text not null,
  description text,
  event_date date not null default current_date,
  clinic_name text,
  veterinarian_name text,
  diagnosis text,
  treatment_plan text,
  attachment_urls text[] default array[]::text[],
  cost numeric(10, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. VACCINATIONS (Preventive protocol records)
create table if not exists public.vaccinations (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  vaccine_name text not null,
  administered_date date not null,
  next_due_date date,
  batch_number text,
  manufacturer text,
  veterinarian_name text,
  clinic_name text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. CARE TASKS & ROUTINES (Feeding, grooming, medication, activities)
create table if not exists public.care_tasks (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category text not null check (category in ('feeding', 'medication', 'grooming', 'exercise', 'hygiene', 'enrichment', 'other')),
  description text,
  frequency text not null default 'once' check (frequency in ('once', 'daily', 'weekly', 'biweekly', 'monthly', 'custom')),
  due_date timestamptz not null,
  is_completed boolean not null default false,
  completed_at timestamptz,
  completed_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. REMINDERS & NOTIFICATIONS
create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete cascade,
  title text not null,
  remind_at timestamptz not null,
  channel text not null default 'in_app' check (channel in ('in_app', 'email', 'push')),
  is_sent boolean not null default false,
  is_dismissed boolean not null default false,
  created_at timestamptz not null default now()
);

-- 7. PET FOOD KNOWLEDGE BASE (Verified nutrition & toxicity)
create table if not exists public.pet_food_knowledge (
  id uuid primary key default gen_random_uuid(),
  species text not null,
  food_name text not null,
  category text not null default 'general',
  safety_level text not null check (safety_level in ('safe', 'caution', 'toxic', 'forbidden')),
  description text not null,
  portion_guidance text,
  preparation_tips text,
  risks_and_symptoms text,
  veterinary_source text not null,
  reviewed_at date not null default current_date,
  created_at timestamptz not null default now()
);

-- 8. CARE KNOWLEDGE BASE (Environmental, behavioral, thermal comfort)
create table if not exists public.care_knowledge (
  id uuid primary key default gen_random_uuid(),
  species text not null,
  topic text not null check (topic in ('nutrition', 'environment', 'exercise', 'hygiene', 'behavior', 'thermal_comfort')),
  title text not null,
  summary text not null,
  full_content text not null,
  min_temp_celsius numeric(4, 1),
  max_temp_celsius numeric(4, 1),
  key_recommendations text[] default array[]::text[],
  source text not null,
  reviewed_at date not null default current_date,
  created_at timestamptz not null default now()
);

-- 9. WEATHER ALERTS (Zeludi Clima alerts)
create table if not exists public.weather_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete cascade,
  alert_type text not null check (alert_type in ('extreme_heat', 'excessive_cold', 'high_humidity', 'rain_storm', 'air_quality', 'safe_window')),
  severity text not null check (severity in ('info', 'caution', 'warning', 'danger')),
  temperature_celsius numeric(4, 1),
  humidity_percent integer,
  condition_text text,
  title text not null,
  message text not null,
  actionable_tips text[] default array[]::text[],
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 10. AI CONVERSATIONS & MESSAGES (Zeludi IA)
create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete cascade,
  title text not null default 'Nova conversa',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  sender_role text not null check (sender_role in ('user', 'assistant', 'system')),
  content text not null,
  is_emergency_flagged boolean not null default false,
  sources_cited jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 11. EMERGENCY CONTACTS (Zeludi SOS & personal contacts)
create table if not exists public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  relationship text not null check (relationship in ('vet', 'clinic_24h', 'pet_sitter', 'relative', 'hospital')),
  phone text not null,
  address text,
  notes text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

-- 12. BUSINESS ARCHITECTURE (Zeludi Business Future Preparation)
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_type text not null check (business_type in ('hotel', 'daycare', 'boarding', 'grooming', 'vet_clinic', 'pet_shop')),
  cnpj_or_tax_id text,
  phone text,
  email text,
  address text,
  city text,
  state text,
  capacity integer,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'manager', 'caretaker', 'receptionist')),
  created_at timestamptz not null default now(),
  unique(business_id, user_id)
);

create table if not exists public.boarding_stays (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  check_in timestamptz not null,
  check_out timestamptz not null,
  status text not null default 'reserved' check (status in ('reserved', 'checked_in', 'checked_out', 'cancelled')),
  special_instructions text,
  emergency_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 13. AUDIT EVENTS (LGPD & Security Compliance)
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb default '{}'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

-- ====================================================================
-- AUTOMATIC TIMESTAMP TRIGGERS
-- ====================================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger set_profiles_updated_at before update on public.profiles for each row execute function public.handle_updated_at();
create or replace trigger set_pets_updated_at before update on public.pets for each row execute function public.handle_updated_at();
create or replace trigger set_pet_health_records_updated_at before update on public.pet_health_records for each row execute function public.handle_updated_at();
create or replace trigger set_vaccinations_updated_at before update on public.vaccinations for each row execute function public.handle_updated_at();
create or replace trigger set_care_tasks_updated_at before update on public.care_tasks for each row execute function public.handle_updated_at();
create or replace trigger set_businesses_updated_at before update on public.businesses for each row execute function public.handle_updated_at();
create or replace trigger set_boarding_stays_updated_at before update on public.boarding_stays for each row execute function public.handle_updated_at();

-- Automatic profile creation on auth.users sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
  set email = excluded.email;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users (Supabase Auth)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS across all tables
alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.pet_health_records enable row level security;
alter table public.vaccinations enable row level security;
alter table public.care_tasks enable row level security;
alter table public.reminders enable row level security;
alter table public.pet_food_knowledge enable row level security;
alter table public.care_knowledge enable row level security;
alter table public.weather_alerts enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.boarding_stays enable row level security;
alter table public.audit_events enable row level security;

-- PROFILES
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- PETS
create policy "Users can view their own pets"
  on public.pets for select
  using (auth.uid() = owner_id);

create policy "Users can insert their own pets"
  on public.pets for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own pets"
  on public.pets for update
  using (auth.uid() = owner_id);

create policy "Users can delete their own pets"
  on public.pets for delete
  using (auth.uid() = owner_id);

-- PET HEALTH RECORDS
create policy "Users can manage health records for their pets"
  on public.pet_health_records for all
  using (
    exists (
      select 1 from public.pets
      where pets.id = pet_health_records.pet_id
      and pets.owner_id = auth.uid()
    )
  );

-- VACCINATIONS
create policy "Users can manage vaccinations for their pets"
  on public.vaccinations for all
  using (
    exists (
      select 1 from public.pets
      where pets.id = vaccinations.pet_id
      and pets.owner_id = auth.uid()
    )
  );

-- CARE TASKS
create policy "Users can manage care tasks for their pets"
  on public.care_tasks for all
  using (
    exists (
      select 1 from public.pets
      where pets.id = care_tasks.pet_id
      and pets.owner_id = auth.uid()
    )
  );

-- REMINDERS
create policy "Users can view and manage their reminders"
  on public.reminders for all
  using (auth.uid() = user_id);

-- KNOWLEDGE BASES (Publicly readable by authenticated users)
create policy "Authenticated users can read food knowledge"
  on public.pet_food_knowledge for select
  to authenticated
  using (true);

create policy "Authenticated users can read care knowledge"
  on public.care_knowledge for select
  to authenticated
  using (true);

-- WEATHER ALERTS
create policy "Users can view and manage their weather alerts"
  on public.weather_alerts for all
  using (auth.uid() = user_id);

-- AI CONVERSATIONS & MESSAGES
create policy "Users can manage their AI conversations"
  on public.ai_conversations for all
  using (auth.uid() = user_id);

create policy "Users can manage their AI messages"
  on public.ai_messages for all
  using (
    exists (
      select 1 from public.ai_conversations
      where ai_conversations.id = ai_messages.conversation_id
      and ai_conversations.user_id = auth.uid()
    )
  );

-- EMERGENCY CONTACTS
create policy "Users can manage their emergency contacts"
  on public.emergency_contacts for all
  using (auth.uid() = user_id);

-- BUSINESSES & STAYS (Isolated by business membership)
create policy "Business members can view their business"
  on public.businesses for select
  using (
    exists (
      select 1 from public.business_members
      where business_members.business_id = businesses.id
      and business_members.user_id = auth.uid()
    )
  );

create policy "Business members can view boarding stays"
  on public.boarding_stays for select
  using (
    exists (
      select 1 from public.business_members
      where business_members.business_id = boarding_stays.business_id
      and business_members.user_id = auth.uid()
    )
  );

-- AUDIT EVENTS
create policy "Users can view their own audit logs"
  on public.audit_events for select
  using (auth.uid() = user_id);

create policy "System can insert audit logs"
  on public.audit_events for insert
  with check (auth.uid() = user_id or auth.uid() is null);

-- ====================================================================
-- SEED INITIAL CURATED NUTRITION KNOWLEDGE
-- ====================================================================

insert into public.pet_food_knowledge (species, food_name, category, safety_level, description, portion_guidance, preparation_tips, risks_and_symptoms, veterinary_source, reviewed_at)
values
  -- Dogs
  ('dog', 'Maçã (sem sementes)', 'Fruta', 'safe', 'Excelente fonte de vitaminas A e C e fibras. Deve sempre ser servida sem sementes e sem o caroço central.', '1 a 2 fatias finas para cães pequenos; até 4 fatias para cães grandes.', 'Lavar bem, remover totalmente as sementes e o talo, cortar em cubos.', 'Sementes contêm cianeto em pequenas quantidades; em excesso causam intoxicação.', 'Conselho Federal de Medicina Veterinária (CFMV) / NRC', '2026-01-15'),
  ('dog', 'Chocolate', 'Doce / Proibido', 'toxic', 'Extremamente tóxico para cães devido à teobromina e cafeína, que o organismo canino metaboliza muito lentamente.', 'NENHUMA QUANTIDADE É SEGURA.', 'Proibido oferecer.', 'Vômitos, diarreia, taquicardia, tremores musculares, convulsões e óbito.', 'American College of Veterinary Pharmacists (ACVP)', '2026-01-15'),
  ('dog', 'Cenoura crua ou cozida', 'Legume', 'safe', 'Ótima para mastigação e saúde dental canina. Baixa caloria e rica em betacaroteno.', 'Meia cenoura pequena ao dia como petisco saudável.', 'Lavar bem, descascar se desejar. Pode servir crua ou cozida no vapor sem sal ou temperos.', 'Consumo excessivo pode soltar o intestino por excesso de fibras.', 'WSAVA Global Nutrition Guidelines', '2026-01-15'),
  ('dog', 'Uva e Uva-passa', 'Fruta / Proibida', 'toxic', 'Grave toxicidade renal idiopática em cães. Mesmo uma única uva pode desencadear insuficiência renal aguda.', 'TOTALMENTE PROIBIDO.', 'Não permitir qualquer acesso.', 'Letargia, vômitos, insuficiência renal aguda oligúrica e risco de morte.', 'ASPCA Animal Poison Control Center', '2026-01-15'),
  ('dog', 'Cebola e Alho', 'Vegetal / Proibido', 'toxic', 'Contêm dissulfetos e tiossulfatos que destroem as hemácias dos cães causando anemia hemolítica grave.', 'TOTALMENTE PROIBIDO.', 'Não oferecer qualquer alimento preparado com alho ou cebola.', 'Gengivas pálidas, fraqueza severa, respiração acelerada, urina avermelhada.', 'Veterinary Information Network (VIN)', '2026-01-15'),
  
  -- Cats
  ('cat', 'Carne de Frango Cozida', 'Proteína', 'safe', 'Excelente proteína de alto valor biológico para carnívoros estritos como felinos.', '1 colher de sopa de frango desfiado sem pele como complemento.', 'Cozida apenas em água pura, sem sal, cebola, alho ou qualquer condimento.', 'Frango cru oferece risco de contaminação por Salmonella e Campylobacter.', 'AAFCO Cat Food Nutrient Profiles', '2026-01-15'),
  ('cat', 'Leite de Vaca', 'Laticínio / Inadequado', 'caution', 'A maioria dos gatos adultos é intolerante à lactose após o desmame.', 'Não recomendado para gatos adultos.', 'Substituir por sachês e fontes de hidratação específicas para felinos.', 'Diarreia osmótica, desconforto abdominal, flatulência e desidratação.', 'Cornell Feline Health Center', '2026-01-15'),
  ('cat', 'Lírios (Plantas)', 'Planta / Letal', 'toxic', 'Todas as partes do lírio são mortalmente tóxicas para gatos. Até o pólen pode causar falência renal irreversível.', 'TOLERÂNCIA ZERO.', 'Manter a planta longe de casas com gatos.', 'Vômito imediato, salivação, insuficiência renal aguda em 24 a 72 horas.', 'ASPCA Poison Control', '2026-01-15'),

  -- Birds
  ('bird', 'Abacate', 'Fruta / Tóxica', 'toxic', 'Contém persina, uma toxina fungicida extremamente perigosa para psitacídeos e passeriformes.', 'ABSOLUTAMENTE TÓXICO PARA AVES.', 'Nunca oferecer.', 'Dificuldade respiratória aguda, acúmulo de líquido pericárdico e morte rápida.', 'Association of Avian Veterinarians (AAV)', '2026-01-15'),
  ('bird', 'Folhas Verdes Escuras (Couve, Espinafre)', 'Verdura', 'safe', 'Excelente enriquecimento alimentar e aporte de cálcio e vitamina A para periquitos, calopsitas e papagaios.', 'Folhas frescas higienizadas presas na gaiola 2 a 3 vezes por semana.', 'Higienizar com solução clorada e enxaguar abundantemente com água potável.', 'Não oferecer se estiver murcha ou fermentada.', 'Association of Avian Veterinarians (AAV)', '2026-01-15'),

  -- Rabbits & Rodents
  ('rabbit', 'Feno de Capim / Timothy', 'Fibra Essencial', 'safe', 'Representa 80% a 85% da dieta de coelhos e porquinhos-da-índia. Essencial para motilidade intestinal e desgaste dental contínuo.', 'DISPONIBILIDADE ILIMITADA 24 HORAS POR DIA.', 'Manter sempre limpo, seco e suspenso em porta-feno.', 'A falta de feno provoca estase gastrointestinal potencialmente fatal e má oclusão dental.', 'House Rabbit Society', '2026-01-15'),
  ('rabbit', 'Batata e Raízes Cruas', 'Amido / Inadequado', 'forbidden', 'Elevado teor de amido e solanina crua, causando fermentação bacteriana letal no ceco do coelho.', 'PROIBIDO.', 'Não oferecer tubérculos crus ou cozidos.', 'Desbiose cecal grave, timpanismo, choque por toxinas bacterianas.', 'House Rabbit Society', '2026-01-15'),
  ('guinea_pig', 'Pimentão Vermelho ou Amarelo', 'Legume rico em Vit C', 'safe', 'Porquinhos-da-índia não sintetizam Vitamina C e necessitam de aporte diário na dieta. O pimentão é uma das melhores fontes.', 'Uma fatia pequena sem sementes por dia.', 'Lavar bem, remover sementes internas.', 'Sem contraindicações graves se moderado.', 'Oxbow Animal Health Guidelines', '2026-01-15'),
  ('hamster', 'Sementes de Girassol em Excesso', 'Semente / Moderação', 'caution', 'Apesar de muito apreciadas, são altamente calóricas e gordurosas, predispondo à obesidade e problemas hepáticos.', 'Máximo de 2 a 3 sementes por semana como agrado.', 'Servir in natura, nunca salgadas ou torradas.', 'Esteatose hepática, desequilíbrio nutricional e carência de cálcio.', 'British Hamster Association', '2026-01-15');

-- Create useful performance indexes
create index if not exists idx_pets_owner_id on public.pets(owner_id);
create index if not exists idx_pet_health_records_pet_id on public.pet_health_records(pet_id);
create index if not exists idx_vaccinations_pet_id on public.vaccinations(pet_id);
create index if not exists idx_care_tasks_pet_id_due on public.care_tasks(pet_id, due_date);
create index if not exists idx_weather_alerts_user_id on public.weather_alerts(user_id);
create index if not exists idx_food_knowledge_species on public.pet_food_knowledge(species, safety_level);
