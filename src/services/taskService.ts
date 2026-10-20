import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import type { CareTask, Vaccination } from '@/types/database.types'

const LOCAL_TASKS_KEY = 'zeludi_tasks_data'
const LOCAL_VACCINES_KEY = 'zeludi_vaccines_data'

export const INITIAL_DEMO_TASKS: CareTask[] = [
  {
    id: 'task-01',
    pet_id: 'pet-golden-01',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Administrar condroprotetor articular (Bento)',
    category: 'medication',
    description: '1 comprimido misturado ao alimento matinal',
    frequency: 'daily',
    due_date: new Date().toISOString(),
    is_completed: false,
    completed_at: null,
    completed_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-02',
    pet_id: 'pet-cat-02',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Limpeza e troca de filtro da fonte de água (Maya)',
    category: 'hygiene',
    description: 'Importante para hidratação preventiva contra cistite',
    frequency: 'weekly',
    due_date: new Date(Date.now() + 86400000).toISOString(),
    is_completed: false,
    completed_at: null,
    completed_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-03',
    pet_id: 'pet-calopsita-03',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Oferecer folha de couve fresca higienizada (Pipoca)',
    category: 'feeding',
    description: 'Enriquecimento alimentar com cálcio e vitaminas',
    frequency: 'weekly',
    due_date: new Date().toISOString(),
    is_completed: true,
    completed_at: new Date().toISOString(),
    completed_by: '00000000-0000-0000-0000-000000000001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-04',
    pet_id: 'pet-rabbit-04',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Reabastecer feno Timothy no comedouro suspenso (Nuvem)',
    category: 'feeding',
    description: 'Feno de capim é vital e nunca pode faltar 24h',
    frequency: 'daily',
    due_date: new Date().toISOString(),
    is_completed: false,
    completed_at: null,
    completed_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const INITIAL_DEMO_VACCINES: Vaccination[] = [
  {
    id: 'vac-01',
    pet_id: 'pet-golden-01',
    user_id: '00000000-0000-0000-0000-000000000001',
    vaccine_name: 'Vacina Múltipla Canina V10',
    administered_date: '2025-11-10',
    next_due_date: '2026-11-10',
    batch_number: 'LOTE-789-V10',
    manufacturer: 'Zoetis',
    veterinarian_name: 'Dra. Camila Vasconcelos',
    clinic_name: 'Harmonia Pet 24h',
    notes: 'Aplicado sem reação adversa.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'vac-02',
    pet_id: 'pet-golden-01',
    user_id: '00000000-0000-0000-0000-000000000001',
    vaccine_name: 'Vacina Antirrábica',
    administered_date: '2025-11-10',
    next_due_date: '2026-11-10',
    batch_number: 'LOTE-441-RAB',
    manufacturer: 'Boehringer Ingelheim',
    veterinarian_name: 'Dra. Camila Vasconcelos',
    clinic_name: 'Harmonia Pet 24h',
    notes: 'Reforço anual obrigatório.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'vac-03',
    pet_id: 'pet-cat-02',
    user_id: '00000000-0000-0000-0000-000000000001',
    vaccine_name: 'Vacina Quádrupla Felina V4',
    administered_date: '2025-12-05',
    next_due_date: '2026-12-05',
    batch_number: 'FEL-990-V4',
    manufacturer: 'Zoetis',
    veterinarian_name: 'Dr. Lucas Faria',
    clinic_name: 'CatLovers Felinos',
    notes: 'Proteção contra rinotraqueíte, calicivirose, panleucopenia e clamidiose.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function fetchTasks(userId?: string): Promise<CareTask[]> {
  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('care_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true })

      if (!error && data) return data as CareTask[]
    } catch (err) {
      console.warn('Fallback to local tasks:', err)
    }
  }

  if (typeof window === 'undefined') return INITIAL_DEMO_TASKS
  const stored = localStorage.getItem(LOCAL_TASKS_KEY)
  if (!stored) {
    localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(INITIAL_DEMO_TASKS))
    return INITIAL_DEMO_TASKS
  }
  try {
    return JSON.parse(stored)
  } catch {
    return INITIAL_DEMO_TASKS
  }
}

export async function toggleTaskComplete(
  taskId: string,
  completed: boolean,
  userId?: string
): Promise<void> {
  const now = new Date().toISOString()

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient()
      await supabase
        .from('care_tasks')
        .update({
          is_completed: completed,
          completed_at: completed ? now : null,
          completed_by: completed && userId ? userId : null,
          updated_at: now,
        })
        .eq('id', taskId)
      return
    } catch (err) {
      console.warn('Supabase task update error:', err)
    }
  }

  if (typeof window !== 'undefined') {
    const tasks = await fetchTasks()
    const updated = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            is_completed: completed,
            completed_at: completed ? now : null,
            completed_by: completed && userId ? userId : null,
            updated_at: now,
          }
        : t
    )
    localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(updated))
  }
}

export async function fetchVaccines(userId?: string): Promise<Vaccination[]> {
  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('vaccinations')
        .select('*')
        .eq('user_id', userId)
        .order('next_due_date', { ascending: true })

      if (!error && data) return data as Vaccination[]
    } catch (err) {
      console.warn('Fallback to local vaccines:', err)
    }
  }

  if (typeof window === 'undefined') return INITIAL_DEMO_VACCINES
  const stored = localStorage.getItem(LOCAL_VACCINES_KEY)
  if (!stored) {
    localStorage.setItem(LOCAL_VACCINES_KEY, JSON.stringify(INITIAL_DEMO_VACCINES))
    return INITIAL_DEMO_VACCINES
  }
  try {
    return JSON.parse(stored)
  } catch {
    return INITIAL_DEMO_VACCINES
  }
}
