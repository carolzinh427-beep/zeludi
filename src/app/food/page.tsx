'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { fetchFoodKnowledge } from '@/services/foodService'
import type { FoodKnowledge, FoodSafetyLevel } from '@/types/database.types'
import { SPECIES_LABELS } from '@/services/petService'
import {
  Utensils,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Stethoscope,
  Info,
  Calendar,
} from 'lucide-react'

export default function FoodNutritionPage() {
  const [foods, setFoods] = useState<FoodKnowledge[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSpecies, setSelectedSpecies] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await fetchFoodKnowledge(selectedSpecies)
      setFoods(data)
      setLoading(false)
    }
    load()
  }, [selectedSpecies])

  const filtered = foods.filter((f) =>
    f.food_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const safetyBadge = (level: FoodSafetyLevel) => {
    switch (level) {
      case 'safe':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#4C885B]/15 text-[#4C885B]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Alimento Seguro
          </span>
        )
      case 'caution':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D69738]/15 text-[#D69738]">
            <AlertTriangle className="w-3.5 h-3.5" />
            Cuidado / Moderação
          </span>
        )
      case 'toxic':
      case 'forbidden':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C75B53]/15 text-[#C75B53]">
            <ShieldAlert className="w-3.5 h-3.5" />
            Tóxico / Proibido
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#829B83]">
            <Utensils className="w-4 h-4 text-[#829B83]" />
            <span>Guia Nutricional</span>
            <span>•</span>
            <span>Base Verificada</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#354A3D] mt-1 tracking-tight">
            Alimentação, Petiscos & Toxicidade
          </h1>
          <p className="text-sm text-[#596B60] mt-1">
            Pesquise o que seu pet pode ou não consumir com base em referências do CFMV, WSAVA e AAFCO.
          </p>
        </div>

        {/* Filter and search bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DCCBB5]/40 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#829B83] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar alimento (ex: maçã, chocolate, feno, frango)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#DCCBB5]/60 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-[#829B83] shrink-0" />
              <select
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="w-full sm:w-auto py-2.5 px-3.5 rounded-2xl border border-[#DCCBB5]/60 text-xs font-medium text-[#354A3D] bg-white cursor-pointer"
              >
                <option value="all">Todas as espécies</option>
                <option value="dog">Cães</option>
                <option value="cat">Gatos</option>
                <option value="bird">Aves</option>
                <option value="rabbit">Coelhos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#596B60]">
            Consultando diretrizes nutricionais...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#DCCBB5]/40 max-w-md mx-auto">
            <Utensils className="w-10 h-10 text-[#829B83] mx-auto mb-2 opacity-50" />
            <h3 className="text-base font-bold text-[#354A3D]">Nenhum alimento cadastrado com esse termo</h3>
            <p className="text-xs text-[#596B60] mt-1">
              Na dúvida, nunca ofereça alimentos condimentados, doces ou plantas desconhecidas ao seu animal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item) => {
              const spInfo = SPECIES_LABELS[item.species as keyof typeof SPECIES_LABELS]
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-6 border border-[#DCCBB5]/40 shadow-xs space-y-4 hover:border-[#829B83] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{spInfo?.icon || '🐾'}</span>
                          <span className="text-[10px] uppercase font-bold text-[#829B83] tracking-wider">
                            {spInfo?.label || item.species} • {item.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#354A3D] mt-1">
                          {item.food_name}
                        </h3>
                      </div>
                      {safetyBadge(item.safety_level)}
                    </div>

                    <p className="text-xs text-[#596B60] leading-relaxed">
                      {item.description}
                    </p>

                    {item.portion_guidance && (
                      <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/30 text-xs">
                        <span className="font-bold text-[#354A3D] block text-[11px] mb-0.5">
                          Porção Recomendada:
                        </span>
                        <p className="text-[#596B60] leading-relaxed">{item.portion_guidance}</p>
                      </div>
                    )}

                    {item.risks_and_symptoms && (
                      <div className="p-3 rounded-2xl bg-[#C75B53]/10 border border-[#C75B53]/20 text-xs">
                        <span className="font-bold text-[#C75B53] block text-[11px] mb-0.5">
                          Riscos e Sinais de Alerta:
                        </span>
                        <p className="text-[#354A3D] leading-relaxed">{item.risks_and_symptoms}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F5F1E8] flex items-center justify-between text-[10px] text-[#87998F]">
                    <span className="truncate max-w-[280px]">Fonte: {item.veterinary_source}</span>
                    <span className="shrink-0 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.reviewed_at).toLocaleDateString('pt-BR')}
                    </span>
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
