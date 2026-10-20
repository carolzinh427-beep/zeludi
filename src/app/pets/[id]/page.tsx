'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { fetchPetById, deletePet, SPECIES_LABELS } from '@/services/petService'
import type { Pet } from '@/types/database.types'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  PawPrint,
  ArrowLeft,
  Edit3,
  Trash2,
  Calendar,
  Scale,
  Sparkles,
  Phone,
  Building,
  HeartPulse,
  Utensils,
  AlertTriangle,
  Info,
  ShieldAlert,
} from 'lucide-react'

function PetDetailContent() {
  const params = useParams()
  const router = useRouter()
  const petId = params.id as string

  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'diet' | 'weather'>('overview')

  useEffect(() => {
    async function load() {
      if (!petId) return
      setLoading(true)
      const data = await fetchPetById(petId)
      setPet(data)
      setLoading(false)
    }
    load()
  }, [petId])

  const handleDelete = async () => {
    if (!pet) return
    if (confirm(`Tem certeza de que deseja excluir permanentemente a ficha de ${pet.name}?`)) {
      const res = await deletePet(pet.id)
      if (!res.error) {
        router.push('/pets')
      } else {
        alert(res.error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#354A3D]"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Navbar />
        <div className="flex-1 max-w-lg mx-auto p-8 text-center flex flex-col items-center justify-center">
          <p className="text-base text-[#596B60] mb-4">Pet não encontrado ou removido.</p>
          <Link href="/pets" className="zeludi-btn-primary">
            Voltar para Meus Pets
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const speciesInfo = SPECIES_LABELS[pet.species] || SPECIES_LABELS.other

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/pets"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#596B60] hover:text-[#354A3D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para Meus Pets</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/pets/${pet.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DCCBB5] text-xs font-medium text-[#354A3D] hover:bg-white transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#829B83]" />
              <span>Editar</span>
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#C75B53]/30 text-xs font-medium text-[#C75B53] hover:bg-[#C75B53]/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir</span>
            </button>
          </div>
        </div>

        {/* Hero Pet Dossier Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCCBB5]/40 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar / Photo */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shrink-0 border-2 border-[#DCCBB5]/50 bg-[#EEF3EF] shadow-xs">
              {pet.photo_url ? (
                <Image
                  src={pet.photo_url}
                  alt={pet.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#829B83]">
                  <span className="text-5xl">{speciesInfo.icon}</span>
                </div>
              )}
            </div>

            {/* Pet Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#354A3D] text-white flex items-center gap-1.5">
                  <span>{speciesInfo.icon}</span>
                  <span>{pet.species_custom || speciesInfo.label}</span>
                </span>
                {pet.is_mixed_breed && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#EEF3EF] text-[#354A3D]">
                    Sem Raça Definida (SRD)
                  </span>
                )}
                {pet.is_neutered && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#4C885B]/15 text-[#4C885B]">
                    Castrado(a)
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-[#354A3D] tracking-tight">
                {pet.name}
              </h1>

              <p className="text-sm font-medium text-[#596B60]">
                {pet.breed || 'Raça não especificada'} {pet.coat_color ? `• ${pet.coat_color}` : ''}
              </p>

              {/* Fast stats row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-[#354A3D]">
                <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#DCCBB5]/30">
                  <Scale className="w-3.5 h-3.5 text-[#829B83]" />
                  <span>{pet.weight_kg ? `${pet.weight_kg} kg` : 'Peso não informado'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#DCCBB5]/30">
                  <Calendar className="w-3.5 h-3.5 text-[#829B83]" />
                  <span>
                    {pet.birth_date
                      ? `Nasc: ${new Date(pet.birth_date).toLocaleDateString('pt-BR')}`
                      : pet.approximate_age_months
                      ? `~${Math.floor(pet.approximate_age_months / 12)} anos`
                      : 'Idade n/d'}
                  </span>
                </div>
                {pet.microchip_number && (
                  <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#DCCBB5]/30">
                    <span className="font-mono text-[11px] text-[#596B60]">Chip: {pet.microchip_number}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Consultation CTA */}
            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <Link
                href={`/ai?petId=${pet.id}`}
                className="zeludi-btn-primary text-xs py-2.5 px-4 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#829B83]" />
                <span>Consultar Zeludi IA</span>
              </Link>
              <Link
                href="/sos"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl bg-[#C75B53]/10 text-[#C75B53] border border-[#C75B53]/30 hover:bg-[#C75B53] hover:text-white transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>SOS Emergência</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#DCCBB5]/50 pb-px mb-8 overflow-x-auto text-xs sm:text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 border-b-2 font-semibold transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'border-[#354A3D] text-[#354A3D]'
                : 'border-transparent text-[#596B60] hover:text-[#354A3D]'
            }`}
          >
            Ficha Geral & Biometria
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('health')}
            className={`px-4 py-2.5 border-b-2 font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'health'
                ? 'border-[#354A3D] text-[#354A3D]'
                : 'border-transparent text-[#596B60] hover:text-[#354A3D]'
            }`}
          >
            <HeartPulse className="w-4 h-4 text-[#829B83]" />
            <span>Saúde & Prescrições</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diet')}
            className={`px-4 py-2.5 border-b-2 font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'diet'
                ? 'border-[#354A3D] text-[#354A3D]'
                : 'border-transparent text-[#596B60] hover:text-[#354A3D]'
            }`}
          >
            <Utensils className="w-4 h-4 text-[#829B83]" />
            <span>Nutrição & Restrições</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('weather')}
            className={`px-4 py-2.5 border-b-2 font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'weather'
                ? 'border-[#354A3D] text-[#354A3D]'
                : 'border-transparent text-[#596B60] hover:text-[#354A3D]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#829B83]" />
            <span>Conforto & Espécie</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physical specifications */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCCBB5]/40 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#354A3D] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#829B83]" />
                <span>Características Físicas</span>
              </h3>

              <div className="divide-y divide-[#F5F1E8] text-xs">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#596B60]">Porte:</span>
                  <span className="font-semibold text-[#354A3D] capitalize">
                    {pet.size_category || 'Médio'}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#596B60]">Tipo de Pelagem / Cobertura:</span>
                  <span className="font-semibold text-[#354A3D] capitalize">
                    {pet.coat_type || 'Curta'}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#596B60]">Cor:</span>
                  <span className="font-semibold text-[#354A3D]">
                    {pet.coat_color || 'Não informada'}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#596B60]">Sexo:</span>
                  <span className="font-semibold text-[#354A3D]">
                    {pet.sex === 'male' ? 'Macho' : pet.sex === 'female' ? 'Fêmea' : 'Indefinido'}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-[#596B60]">Microchip / Registro:</span>
                  <span className="font-semibold text-[#354A3D]">
                    {pet.microchip_number || 'Não cadastrado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Veterinarian Reference Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCCBB5]/40 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#354A3D] flex items-center gap-2">
                <Building className="w-4 h-4 text-[#829B83]" />
                <span>Veterinário de Referência</span>
              </h3>

              {pet.reference_vet_name || pet.reference_vet_clinic ? (
                <div className="space-y-3 text-xs">
                  {pet.reference_vet_name && (
                    <div className="p-3 rounded-2xl bg-[#EEF3EF] text-[#354A3D]">
                      <p className="text-[11px] text-[#596B60]">Profissional:</p>
                      <p className="font-bold text-sm text-[#354A3D] mt-0.5">
                        {pet.reference_vet_name}
                      </p>
                    </div>
                  )}

                  {pet.reference_vet_clinic && (
                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40 text-[#354A3D]">
                      <p className="text-[11px] text-[#596B60]">Clínica / Hospital:</p>
                      <p className="font-semibold text-xs text-[#354A3D] mt-0.5">
                        {pet.reference_vet_clinic}
                      </p>
                    </div>
                  )}

                  {pet.reference_vet_phone && (
                    <a
                      href={`tel:${pet.reference_vet_phone.replace(/\D/g, '')}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#354A3D] bg-[#EEF3EF] hover:bg-[#354A3D] hover:text-white px-3.5 py-2 rounded-xl transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#829B83]" />
                      <span>{pet.reference_vet_phone}</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] text-center text-xs text-[#596B60]">
                  <p>Nenhum veterinário de referência cadastrado ainda.</p>
                  <Link
                    href={`/pets/${pet.id}/edit`}
                    className="text-xs font-semibold text-[#354A3D] underline mt-1 inline-block"
                  >
                    Adicionar dados da clínica
                  </Link>
                </div>
              )}

              {pet.notes && (
                <div className="mt-4 pt-4 border-t border-[#F5F1E8]">
                  <h4 className="text-xs font-semibold text-[#354A3D] mb-1">
                    Observações Individuais:
                  </h4>
                  <p className="text-xs text-[#596B60] leading-relaxed bg-[#FAF8F5] p-3 rounded-2xl border border-[#DCCBB5]/30">
                    {pet.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCCBB5]/40 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#354A3D]">
                  Histórico de Saúde & Medicamentos
                </h3>
                <p className="text-xs text-[#596B60] mt-0.5">
                  Informações informadas pelo tutor para acompanhamento e orientação da IA.
                </p>
              </div>

              <Link
                href={`/health?petId=${pet.id}`}
                className="zeludi-btn-primary text-xs"
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Registrar Vacina ou Consulta</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#354A3D] mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#D69738]" />
                  <span>Condições Médicas Conhecidas</span>
                </h4>
                <p className="text-xs text-[#596B60] leading-relaxed">
                  {pet.health_conditions || 'Nenhuma condição médica ou crônica reportada.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#354A3D] mb-2 flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-[#829B83]" />
                  <span>Medicamentos Prescritos Atuais</span>
                </h4>
                <p className="text-xs text-[#596B60] leading-relaxed">
                  {pet.prescribed_medications || 'Nenhum medicamento de uso contínuo informado.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diet' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCCBB5]/40 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#354A3D]">
                Nutrição, Alergias e Segurança Alimentar
              </h3>
              <p className="text-xs text-[#596B60] mt-0.5">
                Alimentação personalizada de acordo com a espécie e necessidades do organismo.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#354A3D] mb-2">
                  Dieta Atual Informada
                </h4>
                <p className="text-xs text-[#596B60] leading-relaxed">
                  {pet.current_diet || 'Alimentação não detalhada ainda.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#D69738]/10 border border-[#D69738]/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#354A3D] mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#D69738]" />
                    <span>Restrições Alimentares</span>
                  </h4>
                  <p className="text-xs text-[#354A3D] leading-relaxed">
                    {pet.dietary_restrictions || 'Nenhuma restrição registrada.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#C75B53]/10 border border-[#C75B53]/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C75B53] mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#C75B53]" />
                    <span>Alergias Diagnosticadas</span>
                  </h4>
                  <p className="text-xs text-[#354A3D] leading-relaxed">
                    {pet.allergies || 'Nenhuma alergia conhecida.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCCBB5]/40 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#354A3D]">
                Recomendações Específicas para {pet.name} ({speciesInfo.label})
              </h3>
              <p className="text-xs text-[#596B60] mt-0.5">
                Diretrizes de bem-estar térmico e enriquecimento ambiental baseadas na espécie e pelagem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-[#EEF3EF] border border-[#829B83]/30">
                <h4 className="font-bold text-[#354A3D] mb-1.5">
                  Conforto Térmico ({pet.coat_type === 'double_coat' ? 'Subpelo Denso' : 'Pelagem Padrão'})
                </h4>
                <p className="text-[#596B60] leading-relaxed">
                  {pet.species === 'dog' && pet.coat_type === 'double_coat'
                    ? 'Golden Retrievers e cães de pelagem dupla não devem ter seus pelos tosados na máquina, pois a subpelagem funciona como isolante térmico contra o calor e o frio. Escovação regular com rasqueadeira remove pelos mortos e areja a pele.'
                    : pet.species === 'bird'
                    ? 'Aves são extremamente sensíveis a correntes de ar frias e variações bruscas de temperatura. Mantenha a gaiola afastada de ar-condicionado direto e janelas com vento forte.'
                    : pet.species === 'rabbit'
                    ? 'Coelhos suportam bem o frio, mas sofrem risco extremo de estresse térmico em temperaturas acima de 27°C. Mantenha em ambiente ventilado, com água fresca e piso frio disponível.'
                    : 'Acompanhe a temperatura local no módulo Zeludi Clima para horários seguros de atividade e hidratação.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40">
                <h4 className="font-bold text-[#354A3D] mb-1.5">
                  Enriquecimento Ambiental
                </h4>
                <p className="text-[#596B60] leading-relaxed">
                  {pet.species === 'cat'
                    ? 'Gatos necessitam de enriquecimento vertical (prateleiras e arranhadores altos) e múltiplos pontos de água limpa (preferencialmente corrente) para prevenção de cálculos renais.'
                    : pet.species === 'rabbit' || pet.species === 'guinea_pig'
                    ? 'Necessidade inegociável de feno de boa qualidade disponível 24h por dia para desgaste fisiológico dos dentes e peristaltismo cecal saudável.'
                    : pet.species === 'bird'
                    ? 'Brinquedos seguros de madeira natural e folhas verdes escuras frescas promovem estímulo cognitivo e evitam o hábito de arrancar penas por tédio.'
                    : 'Passeios diários com estímulo olfativo ("farejamento") e brinquedos de morder adequados ao porte.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function PetDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#354A3D]"></div>
        </div>
      }
    >
      <PetDetailContent />
    </React.Suspense>
  )
}
