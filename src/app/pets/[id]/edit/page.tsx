'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchPetById, updatePet, SPECIES_LABELS } from '@/services/petService'
import type {
  Pet,
  PetSpecies,
  PetSex,
  PetSizeCategory,
  PetCoatType,
} from '@/types/database.types'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ImageUpload } from '@/components/ui/ImageUpload'
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

function EditPetContent() {
  const params = useParams()
  const router = useRouter()
  const petId = params.id as string

  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    async function load() {
      if (!petId) return
      setLoading(true)
      const pet = await fetchPetById(petId)
      if (pet) {
        setSpecies(pet.species)
        setSpeciesCustom(pet.species_custom || '')
        setName(pet.name || '')
        setBreed(pet.breed || '')
        setIsMixedBreed(pet.is_mixed_breed || false)
        setBirthDate(pet.birth_date || '')
        setApproxAgeMonths(pet.approximate_age_months ? pet.approximate_age_months.toString() : '')
        setSex(pet.sex || 'unknown')
        setIsNeutered(pet.is_neutered || false)
        setWeightKg(pet.weight_kg ? pet.weight_kg.toString() : '')
        setSizeCategory(pet.size_category || 'medium')
        setCoatType(pet.coat_type || 'short')
        setCoatColor(pet.coat_color || '')
        setCurrentDiet(pet.current_diet || '')
        setDietaryRestrictions(pet.dietary_restrictions || '')
        setAllergies(pet.allergies || '')
        setHealthConditions(pet.health_conditions || '')
        setPrescribedMedications(pet.prescribed_medications || '')
        setReferenceVetName(pet.reference_vet_name || '')
        setReferenceVetPhone(pet.reference_vet_phone || '')
        setReferenceVetClinic(pet.reference_vet_clinic || '')
        setMicrochipNumber(pet.microchip_number || '')
        setPhotoUrl(pet.photo_url || '')
        setNotes(pet.notes || '')
      }
      setLoading(false)
    }
    load()
  }, [petId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!name.trim()) {
      setErrorMsg('Por favor, informe o nome do seu pet.')
      return
    }

    setSubmitting(true)

    const updates: Partial<Pet> = {
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
    }

    const res = await updatePet(petId, updates)
    setSubmitting(false)

    if (res.error) {
      setErrorMsg(res.error)
    } else {
      setSuccessMsg('Ficha atualizada com sucesso!')
      setTimeout(() => {
        router.push(`/pets/${petId}`)
      }, 600)
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <Link
            href={`/pets/${petId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#596B60] hover:text-[#354A3D] transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para ficha de {name}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#354A3D] tracking-tight">
            Editar Ficha do Pet
          </h1>
          <p className="text-sm text-[#596B60] mt-1">
            Atualize dados biométricos, tratamentos ou orientações alimentares.
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
              <span>Espécie</span>
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
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 2: Identification & Basics */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCCBB5]/40 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#354A3D] flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-[#829B83]" />
              <span>Identificação Básica</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Nome do Pet *
                </label>
                <input
                  type="text"
                  required
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
                    <span>SRD</span>
                  </label>
                </div>
                <input
                  type="text"
                  disabled={isMixedBreed}
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] disabled:bg-[#FAF8F5] disabled:text-[#87998F] focus:outline-none focus:border-[#354A3D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Data de Nascimento
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
                  Idade Aprox. (meses)
                </label>
                <input
                  type="number"
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
                  <option value="unknown">Indefinido</option>
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
                  <option value="mini">Mini / Toy</option>
                  <option value="small">Pequeno</option>
                  <option value="medium">Médio</option>
                  <option value="large">Grande</option>
                  <option value="giant">Gigante</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Pelagem
                </label>
                <select
                  value={coatType}
                  onChange={(e) => setCoatType(e.target.value as PetCoatType)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] bg-white focus:outline-none focus:border-[#354A3D]"
                >
                  <option value="short">Pelo Curto</option>
                  <option value="medium">Pelo Médio</option>
                  <option value="long">Pelo Longo</option>
                  <option value="curly">Encaracolado</option>
                  <option value="double_coat">Subpelo / Pelagem Dupla</option>
                  <option value="hairless">Sem pelo</option>
                  <option value="feathers">Penas</option>
                  <option value="scales">Escamas</option>
                  <option value="other">Outro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Cor / Marcação
                </label>
                <input
                  type="text"
                  value={coatColor}
                  onChange={(e) => setCoatColor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <ImageUpload
                  value={photoUrl || null}
                  onChange={(val) => setPhotoUrl(val || '')}
                  label="Foto do Pet (Upload da Câmera ou Galeria)"
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
              <span>Nutrição & Saúde</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                Alimentação Atual
              </label>
              <textarea
                rows={2}
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
                  value={prescribedMedications}
                  onChange={(e) => setPrescribedMedications(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Vet Reference */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCCBB5]/40 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#354A3D] flex items-center gap-2 mb-2">
              <Stethoscope className="w-4 h-4 text-[#829B83]" />
              <span>Veterinário de Referência & Observações</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Nome do Veterinário
                </label>
                <input
                  type="text"
                  value={referenceVetName}
                  onChange={(e) => setReferenceVetName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Telefone da Clínica
                </label>
                <input
                  type="text"
                  value={referenceVetPhone}
                  onChange={(e) => setReferenceVetPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Clínica / Hospital
                </label>
                <input
                  type="text"
                  value={referenceVetClinic}
                  onChange={(e) => setReferenceVetClinic(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                  Microchip / Anilha
                </label>
                <input
                  type="text"
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
              href={`/pets/${petId}`}
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
              <span>{submitting ? 'Salvando...' : 'Atualizar Ficha'}</span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}

export default function EditPetPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#354A3D]"></div>
        </div>
      }
    >
      <EditPetContent />
    </React.Suspense>
  )
}
