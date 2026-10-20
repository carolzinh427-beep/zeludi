'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { fetchPets, SPECIES_LABELS } from '@/services/petService'
import { fetchVaccines } from '@/services/taskService'
import type { Pet, Vaccination } from '@/types/database.types'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  HeartPulse,
  PawPrint,
  Calendar,
  Clock,
  ShieldCheck,
  PlusCircle,
  Building,
  User,
  Filter,
} from 'lucide-react'

export default function HealthPage() {
  const { user } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [vaccines, setVaccines] = useState<Vaccination[]>([])
  const [selectedPetId, setSelectedPetId] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [petsData, vacsData] = await Promise.all([
        fetchPets(user?.id),
        fetchVaccines(user?.id),
      ])
      setPets(petsData)
      setVaccines(vacsData)
      setLoading(false)
    }
    load()
  }, [user])

  const filteredVaccines = vaccines.filter(
    (v) => selectedPetId === 'all' || v.pet_id === selectedPetId
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#829B83]">
              <HeartPulse className="w-4 h-4 text-[#829B83]" />
              <span>Saúde Preventiva & Imunização</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#354A3D] mt-1 tracking-tight">
              Calendário de Vacinas & Saúde
            </h1>
            <p className="text-sm text-[#596B60] mt-1">
              Controle de reforços, lotes e histórico preventivo dos seus animais.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => alert('O modal de cadastro de novas vacinas será aberto. Todos os dados são salvos na tabela vaccinations.')}
              className="zeludi-btn-primary text-xs shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Nova Vacina</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DCCBB5]/40 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#829B83] shrink-0" />
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              className="w-full sm:w-auto py-2 px-3.5 rounded-2xl border border-[#DCCBB5]/60 text-xs font-medium text-[#354A3D] bg-white cursor-pointer"
            >
              <option value="all">Todos os pets ({vaccines.length} registros)</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({SPECIES_LABELS[pet.species]?.label || pet.species})
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-[#596B60]">
            As datas de reforço seguem as diretrizes da WSAVA e do médico-veterinário responsável.
          </div>
        </div>

        {/* Vaccines Cards list */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#596B60]">
            Carregando registros de saúde...
          </div>
        ) : filteredVaccines.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#DCCBB5]/40 max-w-md mx-auto">
            <HeartPulse className="w-10 h-10 text-[#829B83] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#354A3D]">Nenhum registro encontrado</h3>
            <p className="text-xs text-[#596B60] mt-1">
              Registre a primeira dose ou reforço para manter a imunização do seu companheiro em dia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVaccines.map((vac) => {
              const pet = pets.find((p) => p.id === vac.pet_id)
              const sp = pet ? SPECIES_LABELS[pet.species] : null

              return (
                <div
                  key={vac.id}
                  className="bg-white rounded-3xl p-6 border border-[#DCCBB5]/40 shadow-xs space-y-4 hover:border-[#829B83] transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#354A3D]">
                          {vac.vaccine_name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4C885B]/15 text-[#4C885B]">
                          Aplicada
                        </span>
                      </div>
                      <p className="text-xs text-[#596B60] mt-0.5 flex items-center gap-1.5">
                        <span>{sp?.icon || '🐾'}</span>
                        <span>
                          Pet: <strong>{pet?.name || 'Pet'}</strong>
                        </span>
                      </p>
                    </div>

                    {vac.batch_number && (
                      <span className="text-[10px] font-mono bg-[#FAF8F5] border border-[#DCCBB5]/30 px-2 py-0.5 rounded-md text-[#596B60]">
                        {vac.batch_number}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/30 text-xs">
                    <div>
                      <span className="text-[10px] text-[#596B60] uppercase block">
                        Data de Aplicação
                      </span>
                      <span className="font-semibold text-[#354A3D]">
                        {new Date(vac.administered_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#596B60] uppercase block">
                        Próximo Reforço
                      </span>
                      <span className="font-semibold text-[#354A3D] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#829B83]" />
                        {vac.next_due_date
                          ? new Date(vac.next_due_date).toLocaleDateString('pt-BR')
                          : 'Conforme avaliação clínica'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-[#596B60] space-y-1">
                    {vac.veterinarian_name && (
                      <p className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#829B83]" />
                        <span>Veterinário: {vac.veterinarian_name}</span>
                      </p>
                    )}
                    {vac.clinic_name && (
                      <p className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#829B83]" />
                        <span>Local: {vac.clinic_name}</span>
                      </p>
                    )}
                    {vac.notes && (
                      <p className="text-[11px] text-[#87998F] italic pt-1">
                        {vac.notes}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
