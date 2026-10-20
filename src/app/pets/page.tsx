'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { fetchPets, deletePet, SPECIES_LABELS } from '@/services/petService'
import type { Pet, PetSpecies } from '@/types/database.types'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  PawPrint,
  PlusCircle,
  HeartPulse,
  Scale,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Search,
  Filter,
  Trash2,
  Edit3,
} from 'lucide-react'

export default function PetsListPage() {
  const { user, isDemo, enableDemoMode } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await fetchPets(user?.id)
      setPets(data)
      setLoading(false)
    }
    load()
  }, [user])

  const handleDelete = async (petId: string, name: string) => {
    if (confirm(`Tem certeza de que deseja remover ${name}? Os registros de histórico associados também serão excluídos.`)) {
      const res = await deletePet(petId)
      if (!res.error) {
        setPets((prev) => prev.filter((p) => p.id !== petId))
      } else {
        alert(res.error)
      }
    }
  }

  const filteredPets = pets.filter((pet) => {
    const matchesSpecies = selectedSpecies === 'all' || pet.species === selectedSpecies
    const matchesSearch =
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSpecies && matchesSearch
  })

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#829B83]">
              <PawPrint className="w-4 h-4 text-[#829B83]" />
              <span>Gestão de Animais</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#354A3D] mt-1 tracking-tight">
              Meus Pets Cadastrados
            </h1>
            <p className="text-sm text-[#596B60] mt-1">
              Fichas completas, protocolos preventivos e rotinas de cada companheiro.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/pets/new"
              className="zeludi-btn-primary text-sm shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Cadastrar Novo Pet</span>
            </Link>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DCCBB5]/40 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#829B83] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome ou raça..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#DCCBB5]/60 focus:outline-none focus:border-[#354A3D] text-sm text-[#354A3D]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-[#829B83] shrink-0" />
              <select
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="w-full sm:w-auto py-2.5 px-3.5 rounded-2xl border border-[#DCCBB5]/60 focus:outline-none focus:border-[#354A3D] text-xs font-medium text-[#354A3D] bg-white cursor-pointer"
              >
                <option value="all">Todas as espécies ({pets.length})</option>
                <option value="dog">Cães</option>
                <option value="cat">Gatos</option>
                <option value="bird">Aves / Pássaros</option>
                <option value="rabbit">Coelhos</option>
                <option value="hamster">Hamsters</option>
                <option value="guinea_pig">Porquinhos-da-Índia</option>
                <option value="ferret">Furões</option>
                <option value="reptile">Répteis</option>
                <option value="other">Outros</option>
              </select>
            </div>
          </div>

          {/* Quick Species Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedSpecies('all')}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                selectedSpecies === 'all'
                  ? 'bg-[#354A3D] text-white shadow-xs'
                  : 'bg-[#EEF3EF] text-[#354A3D] hover:bg-[#DCCBB5]/40'
              }`}
            >
              Todos ({pets.length})
            </button>
            {(['dog', 'cat', 'bird', 'rabbit'] as PetSpecies[]).map((sp) => {
              const count = pets.filter((p) => p.species === sp).length
              const info = SPECIES_LABELS[sp]
              return (
                <button
                  key={sp}
                  type="button"
                  onClick={() => setSelectedSpecies(sp)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                    selectedSpecies === sp
                      ? 'bg-[#354A3D] text-white shadow-xs'
                      : 'bg-[#EEF3EF] text-[#354A3D] hover:bg-[#DCCBB5]/40'
                  }`}
                >
                  <span>{info.icon}</span>
                  <span>{info.label} ({count})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Pet Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#354A3D] mx-auto mb-3"></div>
            <p className="text-sm text-[#596B60]">Carregando fichas dos pets...</p>
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#DCCBB5]/40 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF3EF] text-[#829B83] flex items-center justify-center mx-auto mb-4">
              <PawPrint className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#354A3D]">Nenhum pet encontrado</h3>
            <p className="text-xs text-[#596B60] mt-1.5 max-w-sm mx-auto leading-relaxed">
              {searchQuery || selectedSpecies !== 'all'
                ? 'Nenhum animal corresponde aos filtros atuais. Tente limpar a busca.'
                : 'Você ainda não cadastrou nenhum pet. Adicione seu primeiro animal para iniciar os cuidados inteligentes.'}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/pets/new"
                className="zeludi-btn-primary text-xs w-full sm:w-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Cadastrar Primeiro Pet</span>
              </Link>
              {!user && !isDemo && (
                <button
                  type="button"
                  onClick={enableDemoMode}
                  className="zeludi-btn-secondary text-xs w-full sm:w-auto"
                >
                  Carregar Pets de Exemplo
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => {
              const speciesInfo = SPECIES_LABELS[pet.species] || SPECIES_LABELS.other
              return (
                <div
                  key={pet.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#DCCBB5]/45 hover:border-[#829B83]/60 transition-all duration-300 hover:shadow-md flex flex-col group"
                >
                  {/* Card Top: Photo or Species Banner */}
                  <div className="relative h-48 w-full bg-[#354A3D]/5 overflow-hidden">
                    {pet.photo_url ? (
                      <Image
                        src={pet.photo_url}
                        alt={pet.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#EEF3EF] text-[#829B83]">
                        <span className="text-5xl mb-1">{speciesInfo.icon}</span>
                        <span className="text-xs font-semibold text-[#596B60] uppercase tracking-wider">
                          {speciesInfo.label}
                        </span>
                      </div>
                    )}

                    {/* Species Badge */}
                    <div className="absolute top-3 left-3 bg-[#354A3D]/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                      <span>{speciesInfo.icon}</span>
                      <span>{speciesInfo.label}</span>
                    </div>

                    {/* Quick Edit/Delete buttons */}
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <Link
                        href={`/pets/${pet.id}/edit`}
                        className="p-1.5 rounded-full bg-white/90 text-[#354A3D] hover:bg-white hover:text-[#829B83] shadow-xs transition-colors"
                        title="Editar pet"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(pet.id, pet.name)}
                        className="p-1.5 rounded-full bg-white/90 text-[#C75B53] hover:bg-[#C75B53] hover:text-white shadow-xs transition-colors"
                        title="Excluir pet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-[#354A3D] group-hover:text-[#829B83] transition-colors">
                          {pet.name}
                        </h3>
                        <p className="text-xs text-[#596B60]">
                          {pet.breed || (pet.is_mixed_breed ? 'Sem Raça Definida (SRD)' : 'Raça não informada')}
                        </p>
                      </div>

                      {pet.sex && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-[#EEF3EF] text-[#354A3D]">
                          {pet.sex === 'male' ? 'Macho' : pet.sex === 'female' ? 'Fêmea' : 'Indefinido'}
                        </span>
                      )}
                    </div>

                    {/* Quick Metadata chips */}
                    <div className="grid grid-cols-2 gap-2 my-3 text-xs text-[#596B60]">
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FAF8F5] border border-[#DCCBB5]/25">
                        <Scale className="w-3.5 h-3.5 text-[#829B83] shrink-0" />
                        <span className="truncate">
                          {pet.weight_kg ? `${pet.weight_kg} kg` : 'Peso não informado'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#FAF8F5] border border-[#DCCBB5]/25">
                        <Calendar className="w-3.5 h-3.5 text-[#829B83] shrink-0" />
                        <span className="truncate">
                          {pet.approximate_age_months
                            ? `${Math.floor(pet.approximate_age_months / 12)}a ${pet.approximate_age_months % 12}m`
                            : pet.birth_date
                            ? pet.birth_date.slice(0, 4)
                            : 'Idade n/d'}
                        </span>
                      </div>
                    </div>

                    {/* Health & Diet Alert highlights */}
                    {(pet.health_conditions || pet.dietary_restrictions) && (
                      <div className="mt-auto mb-4 p-2.5 rounded-2xl bg-[#D69738]/10 border border-[#D69738]/20 flex items-start gap-2 text-xs text-[#354A3D]">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#D69738] shrink-0 mt-0.5" />
                        <span className="line-clamp-2 text-[11px] leading-tight">
                          {pet.health_conditions || pet.dietary_restrictions}
                        </span>
                      </div>
                    )}

                    {/* Action Link to Full Dossier */}
                    <Link
                      href={`/pets/${pet.id}`}
                      className="w-full mt-auto py-2.5 px-4 rounded-xl bg-[#EEF3EF] text-[#354A3D] hover:bg-[#354A3D] hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Ver Ficha Completa & Saúde</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
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
