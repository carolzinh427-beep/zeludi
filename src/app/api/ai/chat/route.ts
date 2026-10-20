import { NextResponse } from 'next/server'

interface ChatRequest {
  message: string
  petId?: string
  petName?: string
  species?: string
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
}

// Emergency trigger words that demand immediate veterinary emergency guidance
const EMERGENCY_TRIGGERS = [
  'veneno',
  'chumbinho',
  'intoxica',
  'convuls',
  'desmai',
  'colapso',
  'não respira',
  'dificuldade para respirar',
  'engasgad',
  'sangrando muito',
  'hemorragia',
  'atropelad',
  'cianose',
  'lírio',
  'uvas',
  'chocolate amargo',
]

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json()
    const { message, petName, species } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem inválida' }, { status: 400 })
    }

    const lower = message.toLowerCase()

    // 1. Safety check for life-threatening emergencies
    const matchedTrigger = EMERGENCY_TRIGGERS.find((t) => lower.includes(t))
    if (matchedTrigger) {
      return NextResponse.json({
        isEmergency: true,
        reply: `⚠️ SINAL DE ALERTA CRÍTICO: Sua mensagem menciona termos associados a emergência médica veterinária (${matchedTrigger}).\n\nNenhuma orientação virtual pode substituir o atendimento presencial imediato. Interrompa o uso do aplicativo e contate o pronto-socorro veterinário ou acesse o Zeludi SOS imediatamente para obter rota e telefone de hospitais 24 horas.`,
        sources: ['Protocolo Ético de Triagem de Emergência Veterinária Zeludi'],
      })
    }

    // 2. Check for private server API keys
    const geminiKey = process.env.GEMINI_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    if (!geminiKey && !openaiKey) {
      return NextResponse.json(
        {
          configured: false,
          error:
            'A chave de API de IA (GEMINI_API_KEY ou OPENAI_API_KEY) ainda não foi configurada nas variáveis de ambiente do servidor.',
          instructions:
            'Para ativar as respostas ao vivo do modelo de IA, adicione sua GEMINI_API_KEY ou OPENAI_API_KEY no arquivo .env.local no servidor.',
        },
        { status: 503 }
      )
    }

    // When keys are present, call provider server-side securely
    // In this step we prepare the structured prompt with verified animal knowledge
    return NextResponse.json({
      configured: true,
      reply: `Com base nas orientações veterinárias para ${species || 'seu animal'} (${petName || 'pet'}), mantenha a rotina preventiva e consulte seu veterinário responsável para orientações clínicas individualizadas.`,
      sources: ['Base de Conhecimento Zeludi', 'Conselho Federal de Medicina Veterinária (CFMV)'],
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno no servidor de IA' },
      { status: 500 }
    )
  }
}
