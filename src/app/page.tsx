'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SplashScreen } from '@/components/splash/SplashScreen'
import {
  PawPrint,
  HeartPulse,
  CloudSun,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Lock,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'

const SPECIES_PREVIEWS = [
  {
    id: 'dog',
    name: 'Cães (Caninos)',
    icon: '🐕',
    badge: 'Pelagem Dupla & Porte Variado',
    climateTip: 'Atenção com asfalto quente acima de 28°C para evitar queimaduras nos coxins.',
    nutritionTip: 'Frutas seguras como maçã sem sementes; nunca oferecer uvas ou chocolate.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cat',
    name: 'Gatos (Felinos)',
    icon: '🐈',
    badge: 'Carnívoros Estritos & Neofobia',
    climateTip: 'Estimular hidratação com fontes de água corrente e sachês úmidos em dias secos.',
    nutritionTip: 'Intolerância comum à lactose; cuidado com plantas tóxicas como lírios.',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'bird',
    name: 'Aves & Silvestres',
    icon: '🦜',
    badge: 'Sensibilidade Respiratória Extrema',
    climateTip: 'Proteção absoluta contra correntes de ar frias e fumaças tóxicas de teflon.',
    nutritionTip: 'Folhas verdes escuras higienizadas; abacate é potencialmente letal.',
    image: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rabbit',
    name: 'Coelhos & Roedores',
    icon: '🐇',
    badge: 'Digestão Cecotrófica Contínua',
    climateTip: 'Risco crítico de estresse térmico acima de 27°C; fornecer piso frio e boa ventilação.',
    nutritionTip: '80% da dieta deve ser feno ilimitado para motilidade cecal e desgaste dental.',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
  },
]

export default function HomePage() {
  const router = useRouter()
  const { user, enableDemoMode } = useAuth()
  const [selectedPreview, setSelectedPreview] = useState(SPECIES_PREVIEWS[0])
  const [showSplash, setShowSplash] = useState(false)

  React.useEffect(() => {
    // Show on first visit in the session
    const seen = sessionStorage.getItem('zeludi_seen_session_splash')
    if (!seen) {
      setShowSplash(true)
    }
  }, [])

  const handleDemoAccess = () => {
    enableDemoMode()
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false)
            sessionStorage.setItem('zeludi_seen_session_splash', 'true')
          }}
        />
      )}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
          {/* Subtle decorative background organic glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#829B83]/15 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute top-10 right-10 w-72 h-72 bg-[#DCCBB5]/25 blur-3xl rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF3EF] border border-[#829B83]/30 text-xs font-semibold text-[#354A3D]">
                <PawPrint className="w-3.5 h-3.5 text-[#829B83]" />
                <span>Cada pet é único. Cada cuidado importa.</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#354A3D] tracking-tight leading-[1.12]">
                Cuidados inteligentes e saúde preventiva para seu animal
              </h1>

              <p className="text-base sm:text-lg text-[#596B60] max-w-2xl mx-auto leading-relaxed">
                Gestão completa de fichas médicas, análise térmica ambiental em tempo real, base nutricional revisada e inteligência artificial voltada ao bem-estar do seu pet.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="zeludi-btn-primary text-sm px-6 py-3.5 w-full sm:w-auto shadow-sm"
                  >
                    <span>Acessar Meu Painel</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="zeludi-btn-primary text-sm px-6 py-3.5 w-full sm:w-auto shadow-sm"
                    >
                      <span>Cadastrar Gratuitamente</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={handleDemoAccess}
                      className="zeludi-btn-secondary text-sm px-6 py-3.5 w-full sm:w-auto"
                    >
                      <span>Explorar Modo Demonstração</span>
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-[#596B60]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#829B83]" />
                  Cães, gatos, aves, roedores & silvestres
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#829B83]" />
                  Privacidade LGPD & RLS
                </span>
                <span className="flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-[#829B83]" />
                  Base de dados revisada
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Multi-Species Care Showcase */}
        <section className="py-16 bg-white border-y border-[#DCCBB5]/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#829B83]">
                Diferenciação por Espécie
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#354A3D] mt-1 tracking-tight">
                Recomendações específicas para a biologia de cada pet
              </h3>
              <p className="text-sm text-[#596B60] mt-1">
                Não aplicamos regras genéricas. Cada espécie possui limites térmicos, exigências nutricionais e comportamentos singulares.
              </p>
            </div>

            {/* Species tabs */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4">
              {SPECIES_PREVIEWS.map((sp) => {
                const active = selectedPreview.id === sp.id
                return (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setSelectedPreview(sp)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                      active
                        ? 'bg-[#354A3D] text-white shadow-xs'
                        : 'bg-[#EEF3EF] text-[#354A3D] hover:bg-[#DCCBB5]/40'
                    }`}
                  >
                    <span>{sp.icon}</span>
                    <span>{sp.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Selected Species Detail Card */}
            <div className="mt-6 max-w-4xl mx-auto bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#DCCBB5]/50 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#DCCBB5]/40">
                  <Image
                    src={selectedPreview.image}
                    alt={selectedPreview.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#354A3D]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {selectedPreview.badge}
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4">
                  <div>
                    <span className="text-xs font-bold text-[#829B83] uppercase tracking-wider">
                      Cuidados Personalizados
                    </span>
                    <h4 className="text-xl font-bold text-[#354A3D] mt-0.5">
                      {selectedPreview.name}
                    </h4>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#DCCBB5]/40 space-y-1">
                    <p className="text-xs font-bold text-[#354A3D] flex items-center gap-1.5">
                      <CloudSun className="w-3.5 h-3.5 text-[#829B83]" />
                      <span>Alerta Ambiental & Térmico</span>
                    </p>
                    <p className="text-xs text-[#596B60] leading-relaxed">
                      {selectedPreview.climateTip}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#DCCBB5]/40 space-y-1">
                    <p className="text-xs font-bold text-[#354A3D] flex items-center gap-1.5">
                      <HeartPulse className="w-3.5 h-3.5 text-[#829B83]" />
                      <span>Alimentação & Segurança</span>
                    </p>
                    <p className="text-xs text-[#596B60] leading-relaxed">
                      {selectedPreview.nutritionTip}
                    </p>
                  </div>

                  <Link
                    href="/pets/new"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#354A3D] hover:text-[#223229] underline pt-1"
                  >
                    <span>Cadastrar pet desta espécie agora</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Core Pillars */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#829B83]">
              Funcionalidades
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#354A3D] mt-1 tracking-tight">
              Os 5 Pilares da Zeludi
            </h3>
            <p className="text-sm text-[#596B60] mt-1">
              Desenvolvido com arquitetura modular, segurança de ponta e foco na longevidade animal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCBB5]/40 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF3EF] text-[#354A3D] flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-[#829B83]" />
              </div>
              <h4 className="text-base font-bold text-[#354A3D]">Ficha Cadastral Multi-espécies</h4>
              <p className="text-xs text-[#596B60] leading-relaxed">
                Biometria completa, peso, idade aproximada, pelagem, histórico médico relatado, medicamentos prescritos e veterinário de referência.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCBB5]/40 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF3EF] text-[#354A3D] flex items-center justify-center">
                <CloudSun className="w-6 h-6 text-[#829B83]" />
              </div>
              <h4 className="text-base font-bold text-[#354A3D]">Zeludi Clima & Conforto</h4>
              <p className="text-xs text-[#596B60] leading-relaxed">
                Integração meteorológica real. Alertas conservadores de calor e frio calibrados pelo porte, espécie e pelagem do animal.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCBB5]/40 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF3EF] text-[#354A3D] flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-[#829B83]" />
              </div>
              <h4 className="text-base font-bold text-[#354A3D]">Calendário Preventivo</h4>
              <p className="text-xs text-[#596B60] leading-relaxed">
                Controle de reforços vacinais, rotinas de medicação, consultas veterinárias e tarefas cotidianas de alimentação e escovação.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCBB5]/40 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF3EF] text-[#354A3D] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#829B83]" />
              </div>
              <h4 className="text-base font-bold text-[#354A3D]">Zeludi IA Assistente</h4>
              <p className="text-xs text-[#596B60] leading-relaxed">
                Assistente contextualizada pelo prontuário de cada pet, sustentada por bases veterinárias verificadas e filtros de segurança ética.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCBB5]/40 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C75B53]/10 text-[#C75B53] flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#354A3D]">Zeludi SOS Emergência</h4>
              <p className="text-xs text-[#596B60] leading-relaxed">
                Botão de emergência veterinária com geolocalização e rota para hospitais 24h próximos, independente do modelo de IA.
              </p>
            </div>

            {/* Pillar 6: Security */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCBB5]/40 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF3EF] text-[#354A3D] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#829B83]" />
              </div>
              <h4 className="text-base font-bold text-[#354A3D]">Arquitetura Segura & LGPD</h4>
              <p className="text-xs text-[#596B60] leading-relaxed">
                Supabase PostgreSQL com Row Level Security (RLS) estrito, controle de acesso e preparação para o módulo Zeludi Business.
              </p>
            </div>
          </div>
        </section>

        {/* Pre-footer Call to Action */}
        <section className="py-16 bg-[#354A3D] text-[#F5F1E8]">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Pronto para transformar os cuidados com o seu pet?
            </h3>
            <p className="text-sm text-[#DCCBB5] max-w-xl mx-auto leading-relaxed">
              Junte-se aos tutores que cuidam com inteligência, prevenção e carinho. Acesso imediato no celular e no computador.
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#829B83] text-white font-semibold text-sm hover:bg-[#637C64] transition-all shadow-md"
              >
                <span>Criar Minha Conta Gratuita</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
