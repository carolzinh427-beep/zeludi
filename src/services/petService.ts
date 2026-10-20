import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import type { Pet, PetSpecies } from '@/types/database.types'

const LOCAL_PETS_KEY = 'zeludi_pets_data'

// Rich realistic starter pets for demonstration & immediate functionality
export const INITIAL_DEMO_PETS: Pet[] = [
  {
    id: 'pet-golden-01',
    owner_id: '00000000-0000-0000-0000-000000000001',
    name: 'Bento',
    species: 'dog',
    species_custom: null,
    breed: 'Golden Retriever',
    is_mixed_breed: false,
    birth_date: '2022-04-12',
    approximate_age_months: 42,
    sex: 'male',
    is_neutered: true,
    weight_kg: 31.5,
    size_category: 'large',
    coat_type: 'double_coat',
    coat_color: 'Dourado claro',
    current_diet: 'Ração super premium para cães de grande porte (2x ao dia)',
    dietary_restrictions: 'Sensibilidade a frango com conservantes artificiais',
    allergies: 'Dermatite atópica sazonal na primavera',
    health_conditions: 'Tendência a displasia coxofemoral em monitoramento radiográfico',
    prescribed_medications: 'Condroprotetor articular contínuo',
    reference_vet_name: 'Dra. Camila Vasconcelos',
    reference_vet_phone: '(11) 99123-4455',
    reference_vet_clinic: 'Hospital Veterinário Harmonia Pet 24h',
    microchip_number: '981098123456789',
    photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    notes: 'Muito dócil, adora nadar. Requer escovação profunda 3x por semana devido à subpelagem densa.',
    is_active: true,
    created_at: new Date('2024-01-10').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pet-cat-02',
    owner_id: '00000000-0000-0000-0000-000000000001',
    name: 'Maya',
    species: 'cat',
    species_custom: null,
    breed: 'Siamês',
    is_mixed_breed: false,
    birth_date: '2023-08-20',
    approximate_age_months: 26,
    sex: 'female',
    is_neutered: true,
    weight_kg: 3.8,
    size_category: 'small',
    coat_type: 'short',
    coat_color: 'Seal Point',
    current_diet: 'Alimentação mista: sachê úmido pela manhã e ração seca renal preventiva',
    dietary_restrictions: 'Baixo teor de sódio',
    allergies: 'Nenhuma conhecida',
    health_conditions: 'Histórico de estresse e cistite idiopática felina se houver mudanças no ambiente',
    prescribed_medications: null,
    reference_vet_name: 'Dr. Lucas Faria',
    reference_vet_phone: '(11) 98877-6655',
    reference_vet_clinic: 'Clínica Felina CatLovers',
    microchip_number: '981098123456790',
    photo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    notes: 'Exige fontes de água corrente e enriquecimento vertical (prateleiras altas). Vocaliza bastante.',
    is_active: true,
    created_at: new Date('2024-03-15').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pet-calopsita-03',
    owner_id: '00000000-0000-0000-0000-000000000001',
    name: 'Pipoca',
    species: 'bird',
    species_custom: 'Calopsita Silvestre',
    breed: 'Calopsita (Nymphicus hollandicus)',
    is_mixed_breed: false,
    birth_date: '2024-01-05',
    approximate_age_months: 21,
    sex: 'male',
    is_neutered: false,
    weight_kg: 0.09,
    size_category: 'mini',
    coat_type: 'feathers',
    coat_color: 'Cinza com bochechas alaranjadas',
    current_diet: 'Mistura extrusada específica para psitacídeos, couve fresca e jiló 3x na semana',
    dietary_restrictions: 'Nunca oferecer sementes de maçã, abacate ou chocolate',
    allergies: 'Sensibilidade a vapores de teflon e aerossóis (proibido na cozinha)',
    health_conditions: 'Saudável. Vermifugação e exame de fezes anual em dia.',
    prescribed_medications: null,
    reference_vet_name: 'Dra. Beatriz Silveira (Animais Selvagens e Silvestres)',
    reference_vet_phone: '(11) 97766-3322',
    reference_vet_clinic: 'Centro de Aves & Silvestres Vida Livre',
    microchip_number: 'ANILHA-BR-2024-889',
    photo_url: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=600&q=80',
    notes: 'Gosta de assobiar o Hino Nacional pela manhã. Solta para voos supervisionados diariamente.',
    is_active: true,
    created_at: new Date('2024-06-01').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pet-rabbit-04',
    owner_id: '00000000-0000-0000-0000-000000000001',
    name: 'Nuvem',
    species: 'rabbit',
    species_custom: null,
    breed: 'Mini Lionhead',
    is_mixed_breed: false,
    birth_date: '2023-11-10',
    approximate_age_months: 23,
    sex: 'female',
    is_neutered: true,
    weight_kg: 1.45,
    size_category: 'small',
    coat_type: 'long',
    coat_color: 'Branco polar',
    current_diet: '85% feno de capim Timothy ilimitado, folhas verde-escuras e ração peletizada balanceada',
    dietary_restrictions: 'Sem açúcares, sem cenoura em excesso, sem amido',
    allergies: 'Intolerância a corantes de petisco artificial',
    health_conditions: 'Monitoramento de tricobezoares (bolas de pelo) durante a troca de pelagem',
    prescribed_medications: null,
    reference_vet_name: 'Dra. Beatriz Silveira',
    reference_vet_phone: '(11) 97766-3322',
    reference_vet_clinic: 'Centro de Silvestres Vida Livre',
    microchip_number: null,
    photo_url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
    notes: 'Vive solta no quarto adaptado (rabbit-proof). Muito limpa, usa caixinha higiênica.',
    is_active: true,
    created_at: new Date('2024-05-20').toISOString(),
    updated_at: new Date().toISOString(),
  },
]

function getLocalPets(): Pet[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_PETS
  const stored = localStorage.getItem(LOCAL_PETS_KEY)
  if (!stored) {
    localStorage.setItem(LOCAL_PETS_KEY, JSON.stringify(INITIAL_DEMO_PETS))
    return INITIAL_DEMO_PETS
  }
  try {
    return JSON.parse(stored)
  } catch {
    return INITIAL_DEMO_PETS
  }
}

function saveLocalPets(pets: Pet[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_PETS_KEY, JSON.stringify(pets))
  }
}

export async function fetchPets(userId?: string): Promise<Pet[]> {
  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (!error && data) {
        return data as Pet[]
      }
    } catch (err) {
      console.warn('Falling back to local pet storage due to network/auth error:', err)
    }
  }

  // Fallback to local storage
  const local = getLocalPets()
  if (userId) {
    return local.filter((p) => p.owner_id === userId || p.owner_id.startsWith('00000000'))
  }
  return local
}

export async function fetchPetById(petId: string): Promise<Pet | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .single()

      if (!error && data) {
        return data as Pet
      }
    } catch (err) {
      console.warn('Fallback to local storage for pet:', err)
    }
  }

  const local = getLocalPets()
  const found = local.find((p) => p.id === petId)
  return found || null
}

export async function createPet(
  petData: Omit<Pet, 'id' | 'created_at' | 'updated_at'>,
  userId: string
): Promise<{ pet?: Pet; error?: string }> {
  const newPet: Pet = {
    ...petData,
    id: 'pet-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    owner_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pets')
        .insert({
          ...newPet,
        })
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }
      return { pet: data as Pet }
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Falha ao salvar pet no banco' }
    }
  }

  // Local storage save
  const current = getLocalPets()
  const updated = [newPet, ...current]
  saveLocalPets(updated)
  return { pet: newPet }
}

export async function updatePet(
  petId: string,
  updates: Partial<Pet>
): Promise<{ pet?: Pet; error?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pets')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', petId)
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }
      return { pet: data as Pet }
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Falha ao atualizar pet' }
    }
  }

  const current = getLocalPets()
  const index = current.findIndex((p) => p.id === petId)
  if (index === -1) {
    return { error: 'Pet não encontrado' }
  }

  const updatedPet: Pet = {
    ...current[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  current[index] = updatedPet
  saveLocalPets(current)
  return { pet: updatedPet }
}

export async function deletePet(petId: string): Promise<{ error?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('pets').delete().eq('id', petId)
      if (error) return { error: error.message }
      return {}
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Falha ao deletar pet' }
    }
  }

  const current = getLocalPets()
  const filtered = current.filter((p) => p.id !== petId)
  saveLocalPets(filtered)
  return {}
}

export const SPECIES_LABELS: Record<PetSpecies, { label: string; icon: string; description: string }> = {
  dog: { label: 'Cão', icon: '🐕', description: 'Canino doméstico' },
  cat: { label: 'Gato', icon: '🐈', description: 'Felino doméstico' },
  bird: { label: 'Pássaro / Ave', icon: '🦜', description: 'Calopsitas, periquitos, canários e exóticos' },
  rabbit: { label: 'Coelho', icon: '🐇', description: 'Lagomorfo herbívoro estrito' },
  hamster: { label: 'Hamster', icon: '🐹', description: 'Roedor noturno' },
  guinea_pig: { label: 'Porquinho-da-Índia', icon: '🐹', description: 'Roedor caviomorfo' },
  ferret: { label: 'Furão / Ferret', icon: '🦡', description: 'Mustelídeo carnívoro' },
  reptile: { label: 'Réptil', icon: '🦎', description: 'Tartarugas, pogonas e geckos' },
  other: { label: 'Outra Espécie', icon: '🐾', description: 'Outro animal de estimação' },
}
