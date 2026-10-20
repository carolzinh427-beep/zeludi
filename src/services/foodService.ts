import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import type { FoodKnowledge, FoodSafetyLevel } from '@/types/database.types'

const LOCAL_FOODS_KEY = 'zeludi_foods_data'

export const INITIAL_VERIFIED_FOODS: FoodKnowledge[] = [
  {
    id: 'food-01',
    species: 'dog',
    food_name: 'Maçã (sem sementes e sem talo)',
    category: 'Frutas',
    safety_level: 'safe',
    description: 'Excelente fonte de vitaminas A e C e fibras solúveis. Melhora o trânsito intestinal e é um petisco refrescante.',
    portion_guidance: '1 a 2 fatias finas para cães pequenos; até 4 fatias para cães de grande porte.',
    preparation_tips: 'Lavar bem, remover completamente todas as sementes e o miolo duro antes de oferecer.',
    risks_and_symptoms: 'As sementes de maçã contêm amigdalina, que libera cianeto quando mastigada. Em excesso, provoca intoxicação.',
    veterinary_source: 'Conselho Federal de Medicina Veterinária (CFMV) / NRC Canine Nutrition',
    reviewed_at: '2026-01-15',
    created_at: new Date().toISOString(),
  },
  {
    id: 'food-02',
    species: 'dog',
    food_name: 'Chocolate (todos os tipos)',
    category: 'Doces & Industrializados',
    safety_level: 'toxic',
    description: 'Extremamente tóxico para cães devido à teobromina e teofilina, alcaloides que o fígado canino não metaboliza.',
    portion_guidance: 'NENHUMA QUANTIDADE É SEGURA. Proibido.',
    preparation_tips: 'Manter completamente fora do alcance dos animais.',
    risks_and_symptoms: 'Vômito em jato, taquicardia severa, tremores musculares, convulsões, falência cardiovascular e óbito.',
    veterinary_source: 'American College of Veterinary Pharmacists (ACVP) & Merck Veterinary Manual',
    reviewed_at: '2026-01-15',
    created_at: new Date().toISOString(),
  },
  {
    id: 'food-03',
    species: 'dog',
    food_name: 'Uva e Uva-passa',
    category: 'Frutas Tóxicas',
    safety_level: 'toxic',
    description: 'Causa falência renal aguda idiopática fulminante em cães. Mesmo uma única uva pode desencadear dano tubular irreversível.',
    portion_guidance: 'PROIBIDO TOTALMENTE.',
    preparation_tips: 'Não permitir qualquer contato do cão com uvas frescas ou passas.',
    risks_and_symptoms: 'Vômitos nas primeiras 2 horas, letargia extrema, anúria (parada de micção) e uremia aguda.',
    veterinary_source: 'ASPCA Animal Poison Control Center',
    reviewed_at: '2026-01-15',
    created_at: new Date().toISOString(),
  },
  {
    id: 'food-04',
    species: 'dog',
    food_name: 'Cenoura crua ou no vapor',
    category: 'Legumes',
    safety_level: 'safe',
    description: 'Rica em betacaroteno e potássio. Estimula a mastigação saudável e auxilia no controle de placas bacterianas nos dentes.',
    portion_guidance: 'Meia cenoura pequena ao dia para cães médios.',
    preparation_tips: 'Lavar, cortar em rodelas ou servir inteira congelada em dias quentes como picolé natural.',
    risks_and_symptoms: 'Oferecer pedaços muito grandes pode causar engasgo em cães afobados.',
    veterinary_source: 'WSAVA Global Nutrition Guidelines',
    reviewed_at: '2026-01-15',
    created_at: new Date().toISOString(),
  },
  {
    id: 'food-05',
    species: 'cat',
    food_name: 'Peito de Frango Cozido',
    category: 'Proteínas Nobres',
    safety_level: 'safe',
    description: 'Excelente aporte de aminoácidos essenciais e taurina para felinos (carnívoros estritos).',
    portion_guidance: '1 colher de sopa de frango desfiado sem pele como petisco proteico.',
    preparation_tips: 'Cozinhar apenas em água potável. NUNCA adicionar sal, cebola, alho ou óleo.',
    risks_and_symptoms: 'Frango cru acarreta risco severo de Salmonella e parasitas intestinais.',
    veterinary_source: 'AAFCO Cat Food Nutrient Profiles',
    reviewed_at: '2026-01-15',
    created_at: new Date().toISOString(),
  },
  {
    id: 'food-06',
    species: 'cat',
    food_name: 'Lírios (Planta Lilium / Hemerocallis)',
    category: 'Plantas Tóxicas',
    safety_level: 'toxic',
    description: 'Tolerância ZERO. Até mesmo beber a água do vaso ou ingerir pólen ao se lamber causa necrose tubular renal fulminante.',
    portion_guidance: 'PROIBIDO EM CASAS COM GATOS.',
    preparation_tips: 'Descartar e nunca cultivar lírios onde há felinos.',
    risks_and_symptoms: 'Salivação imediata, vômito, insuficiência renal aguda em menos de 48 horas.',
    veterinary_source: 'Cornell University College of Veterinary Medicine Feline Center',
    reviewed_at: '2026-01-15',
    created_at: new Date().toISOString(),
  },
  {
    id: 'food-07',
    species: 'bird',
    food_name: 'Abacate (polpa, casca e caroço)',
    category: 'Frutas Tóxicas para Aves',
    safety_level: 'toxic',
    description: 'Contém persina, uma toxina cardiotóxica letal para calopsitas, periquitos, canários e papagaios.',
    portion_guidance: 'NUNCA OFERECER.',
    preparation_tips: 'Proibido qualquer contato.',
    risks_and_symptoms: 'Acúmulo de líquido no pericárdio e pulmões, asfixia súbita e parada respiratória em poucas horas.',
    veterinary_source: 'Association of Avian Veterinarians (AAV)',
    reviewed_at: '2026-01-15',
    created_at: new Date().toISOString(),
  },
  {
    id: 'food-08',
    species: 'rabbit',
    food_name: 'Feno de Capim (Timothy / Tifton / Coast-cross)',
    category: 'Fibra Vital',
    safety_level: 'safe',
    description: 'Alimento fundamental e obrigatório. Compõe 80% a 85% de toda a dieta de coelhos e porquinhos-da-índia.',
    portion_guidance: 'DISPONIBILIDADE ILIMITADA 24 HORAS POR DIA.',
    preparation_tips: 'Manter sempre seco, fresco, em porta-feno suspenso para não sujar com urina.',
    risks_and_symptoms: 'A falta de feno causa parada cecal (estase gastrointestinal frequentemente fatal) e má oclusão dos dentes molares.',
    veterinary_source: 'House Rabbit Society & British Veterinary Zoological Society',
    reviewed_at: '2026-01-15',
    created_at: new Date().toISOString(),
  },
]

export async function fetchFoodKnowledge(species?: string): Promise<FoodKnowledge[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient()
      let query = supabase.from('pet_food_knowledge').select('*')
      if (species && species !== 'all') {
        query = query.eq('species', species)
      }
      const { data, error } = await query.order('food_name', { ascending: true })
      if (!error && data) return data as FoodKnowledge[]
    } catch (err) {
      console.warn('Fallback to local foods knowledge:', err)
    }
  }

  if (typeof window === 'undefined') return INITIAL_VERIFIED_FOODS
  const stored = localStorage.getItem(LOCAL_FOODS_KEY)
  if (!stored) {
    localStorage.setItem(LOCAL_FOODS_KEY, JSON.stringify(INITIAL_VERIFIED_FOODS))
    return INITIAL_VERIFIED_FOODS
  }
  try {
    const list: FoodKnowledge[] = JSON.parse(stored)
    if (species && species !== 'all') {
      return list.filter((f) => f.species === species)
    }
    return list
  } catch {
    return INITIAL_VERIFIED_FOODS
  }
}
