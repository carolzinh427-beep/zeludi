'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { createPet, SPECIES_LABELS } from '@/services/petService'
import type {
  Pet,
  PetSpecies,
  PetSex,
  PetSizeCategory,
  PetCoatType,
} from '@/types/database.types'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  PawPrint,
  ArrowLeft,
  Save,
  AlertCircle,
  Stethoscope,
  Utensils,
  Info,
  CheckCircle2,
} from 'lucide-react'

export default function NewPetPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Form State
  const [species, setSpecies] = useState<PetSpecies>('dog')
  const [speciesCustom, setSpeciesCustom] = useState('')
  const [name, setName] = useState('')
  const [breed, setBreed] = useState('')
  const [isMixedBreed, setIsMixedBreed] = useState(false)
  const [birthDate, setBirthDate] = useState('')
  const [approxAgeMonths, setApproxAgeMonths] = useState<string>('')
  const [sex, setSex] = useState<PetSex>('unknown')
  const [isNeutered, setIsNeutered] = useState(false)
  const [weightKg, setWeightKg] = useState<string>('')
  const [sizeCategory, setSizeCategory] = useState<PetSizeCategory>('medium')
  const [coatType, setCoatType] = useState<PetCoatType>('short')
  const [coatColor, setCoatColor] = useState('')
  const [currentDiet, setCurrentDiet] = useState('')
  const [dietaryRestrictions, setDietaryRestrictions] = useState('')
  const [allergies, setAllergies] = useState('')
  const [healthConditions, setHealthConditions] = useState('')
  const [prescribedMedications, setPrescribedMedications] = useState('')
  const [referenceVetName, setReferenceVetName] = useState('')
  const [referenceVetPhone, setReferenceVetPhone] = useState('')
  const [referenceVetClinic, setReferenceVetClinic] = useState('')
  const [microchipNumber, setMicrochipNumber] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!name.trim()) {
      setErrorMsg('Por favor, informe o nome do seu pet.')
      return
    }

    setSubmitting(true)

    const userId = user?.id || '00000000-0000-0000-0000-000000000001'

    const petData: Omit<Pet, 'id' | 'created_at' | 'updated_at'> = {
      owner_id: userId,
      name: name.trim(),
      species,
      species_custom: species === 'other' ? speciesCustom : null,
      breed: isMixedBreed ? 'Sem Raça Definida (SRD)' : breed.trim() || null,
      is_mixed_breed: isMixedBreed,
      birth_date: birthDate || null,
      approximate_age_months: approxAgeMonths ? parseInt(approxAgeMonths, 10) : null,
      sex,
      is_neutered: isNeutered,
      weight_kg: weightKg ? parseFloat(weightKg) : null,
      size_category: sizeCategory,
      coat_type: coatType,
      coat_color: coatColor.trim() || null,
      current_diet: currentDiet.trim() || null,
      dietary_restrictions: dietaryRestrictions.trim() || null,
      allergies: allergies.trim() || null,
      health_conditions: healthConditions.trim() || null,
      prescribed_medications: prescribedMedications.trim() || null,
      reference_vet_name: referenceVetName.trim() || null,
      reference_vet_phone: referenceVetPhone.trim() || null,
      reference_vet_clinic: referenceVetClinic.trim() || null,
      microchip_number: microchipNumber.trim() || null,
      photo_url: photoUrl.trim() || null,
      notes: notes.trim() || null,
      is_active: true,
    }

    const res = await createPet(petData, userId)
    setSubmitting(false)

    if (res.error) {
      setErrorMsg(res.error)
    } else {
      setSuccessMsg(`Ficha de ${name} cadastrada com sucesso!`)
      setTimeout(() => {
        router.push(res.pet?.id ? `/pets/${res.pet.id}` : '/pets')
      }, 700)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <Link
            href="/pets"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#596B60] hover:text-[#354A3D] transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para a lista de pets</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#354A3D] tracking-tight">
            Cadastrar Novo Pet
          </h1>
          <p className="text-sm text-[#596B60] mt-1">
            Cada pet é único. Preencha apenas o que souber — você poderá atualizar o perfil e adicionar registros a qualquer momento.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-[#C75B53]/10 border border-[#C75B53]/25 flex items-start gap-3 text-xs text-[#C75B53]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-[#4C885B]/10 border border-[#4C885B]/25 flex items-start gap-3 text-xs text-[#4C885B]">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Species Selection */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCCBB5]/40 shadow-xs">
            <h2 className="text-base font-bold text-[#354A3D] flex items-center gap-2 mb-4">
              <PawPrint className="w-4 h-4 text-[#829B83]" />
              <span>1. Qual é a espécie do seu pet?</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {(Object.keys(SPECIES_LABELS) as PetSpecies[]).map((sp) => {
                const info = SPECIES_LABELS[sp]
                const isSelected = species === sp
                return (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setSpecies(sp)}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#354A3D] text-white border-[#354A3D] shadow-sm'
                        : 'bg-[#FAF8F5] text-[#354A3D] border-[#DCCBB5]/50 hover:border-[#829B83]'
                    }`}
                  >
                    <span className="text-2xl mb-1">{info.icon}</span>
                    <div>
                      <p className="font-bold text-xs">{info.label}</p>
                      <p
                        className={`text-[10px] line-clamp-1 mt-0.5 ${
                          isSelected ? 'text-[#DCCBB5]' : 'text-[#596B60]'
                        }`}
                      >
                        {info.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {species === 'other' && (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-[#354A3D] mb-1">
                  Especifique a espécie / animal:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Chinchila, Ouriço, Serpente..."
                  value={speciesCustom}
                  onChange={(e) => setSpeciesCustom(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>
            )}
          </div>

          {/* Section 2: Identification & Basics */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCCBB5]/40 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#354A3D] flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-[#829B83]" />
              <span>2. Identificação e Características</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Nome do Pet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Thor, Luna, Pipoca..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D]">
                    Raça / Variedade
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#596B60] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMixedBreed}
                      onChange={(e) => {
                        setIsMixedBreed(e.target.checked)
                        if (e.target.checked) setBreed('')
                      }}
                      className="rounded border-[#DCCBB5] text-[#354A3D] focus:ring-[#829B83]"
                    />
                    <span>Sem Raça Definida (SRD)</span>
                  </label>
                </div>
                <input
                  type="text"
                  disabled={isMixedBreed}
                  placeholder={isMixedBreed ? 'Sem Raça Definida' : 'Ex: Poodle, Siamês, Calopsita...'}
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] disabled:bg-[#FAF8F5] disabled:text-[#87998F] focus:outline-none focus:border-[#354A3D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Data de Nascimento (se souber)
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Ou Idade Aprox. (em meses)
                </label>
                <input
                  type="number"
                  min="1"
                  max="400"
                  placeholder="Ex: 24 (2 anos)"
                  value={approxAgeMonths}
                  onChange={(e) => setApproxAgeMonths(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Sexo
                </label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as PetSex)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] bg-white focus:outline-none focus:border-[#354A3D]"
                >
                  <option value="unknown">Não informado / Indefinido</option>
                  <option value="male">Macho</option>
                  <option value="female">Fêmea</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 12.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Porte
                </label>
                <select
                  value={sizeCategory}
                  onChange={(e) => setSizeCategory(e.target.value as PetSizeCategory)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] bg-white focus:outline-none focus:border-[#354A3D]"
                >
                  <option value="mini">Mini / Toy (até 4kg / aves / roedores)</option>
                  <option value="small">Pequeno (4kg a 10kg)</option>
                  <option value="medium">Médio (10kg a 25kg)</option>
                  <option value="large">Grande (25kg a 45kg)</option>
                  <option value="giant">Gigante (acima de 45kg)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Tipo de Pelagem / Cobertura
                </label>
                <select
                  value={coatType}
                  onChange={(e) => setCoatType(e.target.value as PetCoatType)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] bg-white focus:outline-none focus:border-[#354A3D]"
                >
                  <option value="short">Pelo Curto</option>
                  <option value="medium">Pelo Médio</option>
                  <option value="long">Pelo Longo</option>
                  <option value="curly">Encaracolado / Ondulado</option>
                  <option value="double_coat">Duplo / Subpelo denso (Golden, Husky, etc)</option>
                  <option value="hairless">Sem pelo / Pelagem rala</option>
                  <option value="feathers">Penas (Aves)</option>
                  <option value="scales">Escamas / Carapaça (Répteis)</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Cor / Marcação da Pelagem
                </label>
                <input
                  type="text"
                  placeholder="Ex: Caramelo, Branco com manchas, Rajado..."
                  value={coatColor}
                  onChange={(e) => setCoatColor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  URL da Foto (opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/foto-do-pet.jpg"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-[#354A3D] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNeutered}
                  onChange={(e) => setIsNeutered(e.target.checked)}
                  className="rounded border-[#DCCBB5] text-[#354A3D] focus:ring-[#829B83]"
                />
                <span>Animal castrado / esterilizado</span>
              </label>
            </div>
          </div>

          {/* Section 3: Nutrition & Health */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCCBB5]/40 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#354A3D] flex items-center gap-2 mb-2">
              <Utensils className="w-4 h-4 text-[#829B83]" />
              <span>3. Nutrição e Saúde Preventiva</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                Alimentação Atual
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Ração Super Premium 2x ao dia; sachê de hidratação pela manhã; feno à vontade..."
                value={currentDiet}
                onChange={(e) => setCurrentDiet(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Restrições Alimentares
                </label>
                <input
                  type="text"
                  placeholder="Ex: Não pode comer gordura, grãos com glúten..."
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Alergias Conhecidas
                </label>
                <input
                  type="text"
                  placeholder="Ex: Alergia a picada de pulga, dipirona..."
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Condições de Saúde Relatadas
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cardiopatia leve, displasia, histórico renal..."
                  value={healthConditions}
                  onChange={(e) => setHealthConditions(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Medicamentos Prescritos Atuais
                </label>
                <input
                  type="text"
                  placeholder="Ex: Condroprotetor 1x ao dia..."
                  value={prescribedMedications}
                  onChange={(e) => setPrescribedMedications(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Vet Reference & Microchip */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCCBB5]/40 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#354A3D] flex items-center gap-2 mb-2">
              <Stethoscope className="w-4 h-4 text-[#829B83]" />
              <span>4. Veterinário de Referência & Observações</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Nome do Veterinário
                </label>
                <input
                  type="text"
                  placeholder="Ex: Dra. Camila Santos"
                  value={referenceVetName}
                  onChange={(e) => setReferenceVetName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Telefone / WhatsApp da Clínica
                </label>
                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                  value={referenceVetPhone}
                  onChange={(e) => setReferenceVetPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Nome da Clínica ou Hospital 24h
                </label>
                <input
                  type="text"
                  placeholder="Ex: Hospital Veterinário Harmonia"
                  value={referenceVetClinic}
                  onChange={(e) => setReferenceVetClinic(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Número do Microchip / Anilha
                </label>
                <input
                  type="text"
                  placeholder="Ex: 981098123456789 ou ANILHA-BR-123"
                  value={microchipNumber}
                  onChange={(e) => setMicrochipNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Observações Comportamentais
                </label>
                <input
                  type="text"
                  placeholder="Ex: Medo de trovões e fogos de artifício; adora água..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/pets"
              className="px-6 py-3 rounded-2xl border border-[#DCCBB5] text-xs font-medium text-[#354A3D] hover:bg-white"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="zeludi-btn-primary px-8 py-3.5 text-sm shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Salvando ficha...' : 'Salvar Ficha do Pet'}</span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
