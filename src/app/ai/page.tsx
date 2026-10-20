'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { fetchPets, SPECIES_LABELS } from '@/services/petService'
import type { Pet } from '@/types/database.types'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  Sparkles,
  PawPrint,
  Send,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  Info,
  KeyRound,
  ShieldAlert,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isEmergency?: boolean
  sources?: string[]
}

function AiChatContent() {
  const searchParams = useSearchParams()
  const petIdFromQuery = searchParams.get('petId')
  const { user } = useAuth()

  const [pets, setPets] = useState<Pet[]>([])
  const [selectedPetId, setSelectedPetId] = useState<string>('')
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content:
        'Olá! Sou a assistente inteligente da Zeludi. Posso tirar dúvidas sobre alimentos seguros para cada espécie, dicas de enriquecimento ambiental, rotinas e cuidados climáticos para o seu companheiro.\n\nLembre-se: não realizo diagnósticos nem prescrevo medicamentos.',
      sources: ['Protocolo Ético de Bem-Estar Animal Zeludi'],
    },
  ])
  const [loading, setLoading] = useState(false)
  const [apiPendingNotice, setApiPendingNotice] = useState<string | null>(null)

  useEffect(() => {
    async function loadPets() {
      const data = await fetchPets(user?.id)
      setPets(data)
      if (petIdFromQuery) {
        setSelectedPetId(petIdFromQuery)
      } else if (data.length > 0) {
        setSelectedPetId(data[0].id)
      }
    }
    loadPets()
  }, [user, petIdFromQuery])

  const selectedPet = pets.find((p) => p.id === selectedPetId)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || loading) return

    const userText = inputMessage.trim()
    setInputMessage('')
    setApiPendingNotice(null)

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: userText,
    }

    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          petId: selectedPet?.id,
          petName: selectedPet?.name,
          species: selectedPet?.species,
        }),
      })

      const data = await res.json()

      if (res.status === 503) {
        setApiPendingNotice(data.instructions || data.error)
        setMessages((prev) => [
          ...prev,
          {
            id: 'asst-' + Date.now(),
            role: 'assistant',
            content: `A integração com o modelo de IA no servidor está aguardando configuração da chave de API (GEMINI_API_KEY ou OPENAI_API_KEY no arquivo .env.local). Conforme as diretrizes de integridade da Zeludi, não simulamos respostas fictícias.`,
            sources: ['Configuração de Sistema'],
          },
        ])
      } else if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'asst-' + Date.now(),
            role: 'assistant',
            content: data.reply,
            isEmergency: data.isEmergency,
            sources: data.sources,
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'asst-err-' + Date.now(),
          role: 'assistant',
          content: 'Houve uma falha de comunicação com o servidor de IA. Tente novamente mais tarde.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickQuestion = (q: string) => {
    setInputMessage(q)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#829B83]">
              <Sparkles className="w-4 h-4 text-[#829B83]" />
              <span>Zeludi IA</span>
              <span>•</span>
              <span>Orientação Preventiva</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#354A3D] mt-1 tracking-tight">
              Assistente de Cuidados
            </h1>
            <p className="text-xs sm:text-sm text-[#596B60] mt-0.5">
              Tire dúvidas baseadas em fontes veterinárias revisadas para seu pet.
            </p>
          </div>

          {/* Pet Selector */}
          {pets.length > 0 && (
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#DCCBB5]/60 shadow-xs">
              <PawPrint className="w-4 h-4 text-[#829B83]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-[#596B60] font-medium uppercase">
                  Contexto do Pet
                </span>
                <select
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  className="text-xs font-bold text-[#354A3D] bg-transparent focus:outline-none cursor-pointer"
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({SPECIES_LABELS[p.species]?.label || p.species})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* API Key Status Notice */}
        {apiPendingNotice && (
          <div className="mb-4 p-4 rounded-2xl bg-[#D69738]/10 border border-[#D69738]/25 text-xs text-[#354A3D] flex items-start gap-3">
            <KeyRound className="w-4 h-4 text-[#D69738] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Integração de IA Pendente</p>
              <p className="text-[#596B60] mt-0.5">{apiPendingNotice}</p>
            </div>
          </div>
        )}

        {/* Chat Window */}
        <div className="flex-1 bg-white rounded-3xl p-5 sm:p-6 border border-[#DCCBB5]/40 shadow-xs flex flex-col justify-between min-h-[460px]">
          {/* Messages list */}
          <div className="space-y-4 overflow-y-auto max-h-[460px] pr-2">
            {messages.map((m) => {
              const isUser = m.role === 'user'
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-[#354A3D] text-[#829B83] flex items-center justify-center shrink-0 text-sm">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-[#354A3D] text-white rounded-tr-xs'
                        : m.isEmergency
                        ? 'bg-[#C75B53]/10 text-[#C75B53] border border-[#C75B53]/30 font-medium'
                        : 'bg-[#FAF8F5] text-[#354A3D] border border-[#DCCBB5]/40 rounded-tl-xs'
                    }`}
                  >
                    {m.isEmergency && (
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#C75B53] mb-2">
                        <ShieldAlert className="w-4 h-4" />
                        <span>AVISO DE EMERGÊNCIA</span>
                      </div>
                    )}

                    <p>{m.content}</p>

                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-[#DCCBB5]/20 text-[10px] text-[#87998F]">
                        Fontes: {m.sources.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#596B60] italic py-2">
                <Sparkles className="w-3.5 h-3.5 text-[#829B83] animate-spin" />
                <span>Consultando diretrizes e prontuário do animal...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="pt-4 border-t border-[#F5F1E8] mt-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-[11px]">
              <span className="text-[#87998F] shrink-0 font-medium">Sugestões:</span>
              <button
                type="button"
                onClick={() =>
                  handleQuickQuestion(
                    `Quais alimentos são estritamente proibidos para meu ${selectedPet?.species || 'pet'}?`
                  )
                }
                className="px-2.5 py-1 rounded-xl bg-[#FAF8F5] border border-[#DCCBB5]/40 text-[#354A3D] hover:bg-[#EEF3EF] shrink-0 transition-colors"
              >
                Alimentos proibidos
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickQuestion(
                    `Como posso enriquecer o ambiente para meu ${selectedPet?.species || 'pet'}?`
                  )
                }
                className="px-2.5 py-1 rounded-xl bg-[#FAF8F5] border border-[#DCCBB5]/40 text-[#354A3D] hover:bg-[#EEF3EF] shrink-0 transition-colors"
              >
                Enriquecimento ambiental
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickQuestion(
                    `Quais cuidados térmicos preciso ter hoje para meu ${selectedPet?.name || 'pet'}?`
                  )
                }
                className="px-2.5 py-1 rounded-xl bg-[#FAF8F5] border border-[#DCCBB5]/40 text-[#354A3D] hover:bg-[#EEF3EF] shrink-0 transition-colors"
              >
                Cuidados com o clima
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder={
                  selectedPet
                    ? `Pergunte algo sobre ${selectedPet.name}...`
                    : 'Faça uma pergunta sobre cuidados ou nutrição pet...'
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl border border-[#DCCBB5]/60 text-xs sm:text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D] bg-[#FAF8F5]"
              />

              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="zeludi-btn-primary p-3 rounded-2xl disabled:opacity-40 shadow-xs shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Ethical disclaimer footer */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#EEF3EF] border border-[#829B83]/30 text-[11px] text-[#596B60] flex items-center gap-2.5">
          <Stethoscope className="w-4 h-4 text-[#829B83] shrink-0" />
          <span>
            <strong>Diretriz de Segurança:</strong> A IA Zeludi responde com base em dados veterinários verificados. Se suspeitar de emergência clínica ou intoxicação aguda, acerte atendimento presencial ou acione o <strong>Zeludi SOS</strong>.
          </span>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function AiChatPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#354A3D]"></div>
        </div>
      }
    >
      <AiChatContent />
    </React.Suspense>
  )
}
