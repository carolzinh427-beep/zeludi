'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { fetchPets, SPECIES_LABELS } from '@/services/petService'
import { fetchCurrentWeather, type WeatherData } from '@/services/weatherService'
import { fetchTasks, toggleTaskComplete, fetchVaccines } from '@/services/taskService'
import type { Pet, CareTask, Vaccination } from '@/types/database.types'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  PawPrint,
  HeartPulse,
  CloudSun,
  Sparkles,
  ShieldAlert,
  PlusCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Droplets,
  Wind,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react'

export default function DashboardPage() {
  const { user, profile, isDemo, enableDemoMode, isConfigured } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [tasks, setTasks] = useState<CareTask[]>([])
  const [vaccines, setVaccines] = useState<Vaccination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      try {
        const [petsData, weatherData, tasksData, vaccinesData] = await Promise.all([
          fetchPets(user?.id),
          fetchCurrentWeather(
            profile?.latitude || -23.55052,
            profile?.longitude || -46.633308,
            profile?.city || 'São Paulo'
          ),
          fetchTasks(user?.id),
          fetchVaccines(user?.id),
        ])

        setPets(petsData)
        setWeather(weatherData)
        setTasks(tasksData)
        setVaccines(vaccinesData)
      } catch (err) {
        console.error('Error loading dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user, profile])

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    await toggleTaskComplete(taskId, !currentStatus, user?.id)
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, is_completed: !currentStatus } : t))
    )
  }

  const completedTasksCount = tasks.filter((t) => t.is_completed).length
  const pendingTasks = tasks.filter((t) => !t.is_completed)

  const [greeting, setGreeting] = useState('Olá')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Bom dia')
    else if (hour < 18) setGreeting('Boa tarde')
    else setGreeting('Boa noite')
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#829B83]">
              <span>Painel de Cuidados Preventivos</span>
              {isDemo && (
                <span className="px-2 py-0.5 rounded-full bg-[#D69738]/15 text-[#D69738] font-bold">
                  Modo Demonstração
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#354A3D] mt-1 tracking-tight">
              {greeting},{' '}
              <span className="text-[#829B83]">
                {profile?.full_name ? profile.full_name.split(' ')[0] : user ? 'Tutor' : 'Visitante'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#596B60] mt-1">
              {pets.length > 0
                ? `Você possui ${pets.length} ${pets.length === 1 ? 'pet cadastrado' : 'pets cadastrados'} com rotinas e monitoramento ativo.`
                : 'Cadastre seu primeiro animal para iniciar o acompanhamento personalizado.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sos"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#C75B53]/10 text-[#C75B53] border border-[#C75B53]/30 font-semibold text-xs hover:bg-[#C75B53] hover:text-white transition-all shadow-xs"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>SOS Emergência 24h</span>
            </Link>

            <Link
              href="/pets/new"
              className="zeludi-btn-primary text-xs shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo Pet</span>
            </Link>
          </div>
        </div>

        {/* Demo banner helper if not connected to live Supabase */}
        {!isConfigured && !user && (
          <div className="mb-8 p-4 rounded-3xl bg-white border border-[#DCCBB5]/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#354A3D]">Experimentando a Zeludi?</p>
              <p className="text-xs text-[#596B60] mt-0.5">
                Você pode carregar imediatamente perfis de teste de cães, gatos, aves e coelhos com um clique.
              </p>
            </div>
            <button
              type="button"
              onClick={enableDemoMode}
              className="zeludi-btn-secondary text-xs shrink-0"
            >
              Carregar Dados de Exemplo
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2 Columns: Pets & Weather & Recommendations */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Pets Access Carousel / Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCBB5]/40 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <PawPrint className="w-4 h-4 text-[#829B83]" />
                  <h2 className="text-base font-bold text-[#354A3D]">
                    Meus Companheiros ({pets.length})
                  </h2>
                </div>

                <Link
                  href="/pets"
                  className="text-xs font-semibold text-[#829B83] hover:text-[#354A3D] flex items-center gap-1 transition-colors"
                >
                  <span>Ver todos</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="py-8 text-center text-xs text-[#596B60]">
                  Carregando animais...
                </div>
              ) : pets.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#FAF8F5] text-center border border-[#DCCBB5]/40">
                  <PawPrint className="w-8 h-8 text-[#829B83] mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold text-[#354A3D]">Nenhum pet cadastrado</p>
                  <p className="text-[11px] text-[#596B60] mt-1">
                    Adicione seus animais para visualizar orientações personalizadas.
                  </p>
                  <Link
                    href="/pets/new"
                    className="zeludi-btn-primary text-xs mt-4 inline-flex"
                  >
                    Cadastrar Pet
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pets.map((pet) => {
                    const sp = SPECIES_LABELS[pet.species] || SPECIES_LABELS.other
                    return (
                      <Link
                        key={pet.id}
                        href={`/pets/${pet.id}`}
                        className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40 hover:border-[#829B83] hover:shadow-xs transition-all flex items-center gap-4 group"
                      >
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-[#EEF3EF] border border-[#DCCBB5]/40">
                          {pet.photo_url ? (
                            <Image
                              src={pet.photo_url}
                              alt={pet.name}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                              {sp.icon}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-[#354A3D] truncate group-hover:text-[#829B83] transition-colors">
                              {pet.name}
                            </h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#354A3D]/10 text-[#354A3D] font-medium shrink-0">
                              {sp.label}
                            </span>
                          </div>

                          <p className="text-xs text-[#596B60] truncate mt-0.5">
                            {pet.breed || (pet.is_mixed_breed ? 'SRD' : 'Sem raça especificada')}
                          </p>

                          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#87998F]">
                            {pet.weight_kg && <span>{pet.weight_kg} kg</span>}
                            {pet.weight_kg && pet.coat_type && <span>•</span>}
                            {pet.coat_type && <span className="capitalize">{pet.coat_type}</span>}
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-[#829B83] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Weather & Thermal Guidance Widget (Section 7) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCBB5]/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudSun className="w-4 h-4 text-[#829B83]" />
                  <h2 className="text-base font-bold text-[#354A3D]">
                    Zeludi Clima & Conforto Térmico Local
                  </h2>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#EEF3EF] text-[#354A3D]">
                  Dados Meteorológicos Reais
                </span>
              </div>

              {weather ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40 text-center">
                    <div>
                      <span className="text-[10px] font-semibold text-[#596B60] uppercase">
                        Temperatura
                      </span>
                      <p className="text-2xl font-black text-[#354A3D] mt-0.5">
                        {weather.temperature}°C
                      </p>
                      <span className="text-[10px] text-[#87998F]">
                        Sensação: {weather.apparentTemperature}°C
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-[#596B60] uppercase flex items-center justify-center gap-1">
                        <Droplets className="w-3 h-3 text-[#829B83]" />
                        <span>Umidade</span>
                      </span>
                      <p className="text-2xl font-black text-[#354A3D] mt-0.5">
                        {weather.humidity}%
                      </p>
                      <span className="text-[10px] text-[#87998F]">
                        {weather.humidity < 40 ? 'Ar Seco' : weather.humidity > 80 ? 'Muito Úmido' : 'Normal'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-[#596B60] uppercase flex items-center justify-center gap-1">
                        <Wind className="w-3 h-3 text-[#829B83]" />
                        <span>Vento</span>
                      </span>
                      <p className="text-2xl font-black text-[#354A3D] mt-0.5">
                        {weather.windSpeed} km/h
                      </p>
                      <span className="text-[10px] text-[#87998F]">Brisa suave</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-[#596B60] uppercase">
                        Condição
                      </span>
                      <p className="text-xs font-bold text-[#354A3D] mt-1.5 leading-snug">
                        {weather.conditionText}
                      </p>
                      <span className="text-[10px] text-[#87998F]">{weather.city}</span>
                    </div>
                  </div>

                  {/* Species Thermal Alert banner */}
                  {weather.temperature >= 27 ? (
                    <div className="p-4 rounded-2xl bg-[#D69738]/10 border border-[#D69738]/30 flex items-start gap-3 text-xs text-[#354A3D]">
                      <AlertTriangle className="w-4 h-4 text-[#D69738] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Alerta de Calor Moderado a Elevado ({weather.temperature}°C)</p>
                        <p className="text-[11px] text-[#596B60] mt-0.5 leading-relaxed">
                          • <strong>Cães:</strong> Teste o asfalto com as costas da mão por 7 segundos antes de passear. Prefira saídas antes das 09h ou após as 18h.
                          <br />
                          • <strong>Coelhos e Roedores:</strong> Risco crítico de estresse térmico. Disponibilize piso frio/cerâmica e sombra ventilada.
                        </p>
                      </div>
                    </div>
                  ) : weather.temperature <= 16 ? (
                    <div className="p-4 rounded-2xl bg-[#829B83]/15 border border-[#829B83]/30 flex items-start gap-3 text-xs text-[#354A3D]">
                      <CloudSun className="w-4 h-4 text-[#829B83] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Alerta de Temperatura Amana / Fria ({weather.temperature}°C)</p>
                        <p className="text-[11px] text-[#596B60] mt-0.5 leading-relaxed">
                          • <strong>Aves:</strong> Isole gaiolas de correntes de ar frias diretas de portas ou janelas.
                          <br />
                          • <strong>Cães idosos ou com displasia:</strong> Maior rigidez articular com o frio; mantenha caminhas forradas.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#4C885B]/10 border border-[#4C885B]/25 flex items-start gap-3 text-xs text-[#354A3D]">
                      <CheckCircle2 className="w-4 h-4 text-[#4C885B] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-[#4C885B]">Faixa Térmica Favorável ({weather.temperature}°C)</p>
                        <p className="text-[11px] text-[#596B60] mt-0.5 leading-relaxed">
                          Condições confortáveis para a maioria das espécies. Mantenha hidratação constante com água fresca e limpa.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-[#596B60]">
                  Consultando satélites meteorológicos...
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Tasks & Upcoming Vaccines */}
          <div className="space-y-8">
            {/* Daily Care Routine & Tasks */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCBB5]/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#829B83]" />
                  <h2 className="text-base font-bold text-[#354A3D]">
                    Rotina & Tarefas do Dia
                  </h2>
                </div>
                <span className="text-xs font-semibold text-[#829B83]">
                  {completedTasksCount}/{tasks.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#FAF8F5] rounded-full h-2 overflow-hidden border border-[#DCCBB5]/30">
                <div
                  className="bg-[#354A3D] h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${tasks.length ? (completedTasksCount / tasks.length) * 100 : 0}%`,
                  }}
                />
              </div>

              <div className="space-y-2.5 pt-2">
                {tasks.length === 0 ? (
                  <p className="text-xs text-[#596B60] text-center py-4">
                    Nenhuma tarefa pendente para hoje.
                  </p>
                ) : (
                  tasks.map((task) => {
                    const pet = pets.find((p) => p.id === task.pet_id)
                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                          task.is_completed
                            ? 'bg-[#FAF8F5]/60 border-[#DCCBB5]/25 opacity-75'
                            : 'bg-[#FAF8F5] border-[#DCCBB5]/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.is_completed}
                          onChange={() => handleToggleTask(task.id, task.is_completed)}
                          className="mt-0.5 rounded border-[#DCCBB5] text-[#354A3D] focus:ring-[#829B83] cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-bold ${
                              task.is_completed
                                ? 'line-through text-[#87998F]'
                                : 'text-[#354A3D]'
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-[11px] text-[#596B60] mt-0.5 line-clamp-1">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-[#829B83]">
                            <span className="capitalize">{task.category}</span>
                            {pet && <span>• {pet.name}</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Upcoming Vaccines / Health Schedule */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCBB5]/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-[#829B83]" />
                  <h2 className="text-base font-bold text-[#354A3D]">
                    Próximas Vacinas & Reforços
                  </h2>
                </div>
                <Link
                  href="/health"
                  className="text-xs font-semibold text-[#829B83] hover:text-[#354A3D]"
                >
                  Ver todas
                </Link>
              </div>

              <div className="space-y-3">
                {vaccines.map((vac) => {
                  const pet = pets.find((p) => p.id === vac.pet_id)
                  return (
                    <div
                      key={vac.id}
                      className="p-3.5 rounded-2xl bg-[#EEF3EF]/60 border border-[#829B83]/20 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#354A3D]">
                          {vac.vaccine_name}
                        </span>
                        <span className="text-[10px] font-semibold text-[#4C885B] bg-[#4C885B]/15 px-2 py-0.5 rounded-full">
                          Reforço em dia
                        </span>
                      </div>
                      <p className="text-[11px] text-[#596B60]">
                        Pet: <strong>{pet?.name || 'Pet'}</strong> • Veterinário: {vac.veterinarian_name || 'Clínica'}
                      </p>
                      {vac.next_due_date && (
                        <div className="flex items-center gap-1.5 text-[10px] text-[#829B83] pt-1">
                          <Clock className="w-3 h-3" />
                          <span>Próxima dose: {new Date(vac.next_due_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick AI Consultation Card */}
            <div className="p-6 rounded-3xl bg-[#354A3D] text-[#F5F1E8] shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#829B83] text-[#354A3D] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Zeludi IA Assistente</h3>
              <p className="text-xs text-[#DCCBB5] leading-relaxed">
                Tire dúvidas sobre alimentos seguros, enriquecimento ambiental ou rotinas específicas para o seu animal.
              </p>
              <Link
                href="/ai"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#829B83] hover:text-white transition-colors pt-1"
              >
                <span>Iniciar conversa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
