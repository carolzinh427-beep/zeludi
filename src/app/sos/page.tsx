'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  ShieldAlert,
  Phone,
  MapPin,
  Clock,
  Compass,
  Search,
  ExternalLink,
  AlertTriangle,
  Stethoscope,
  Filter,
} from 'lucide-react'

interface VetClinic {
  id: string
  name: string
  is24h: boolean
  speciesAttended: string[]
  address: string
  city: string
  state: string
  phone: string
  distanceKm?: number
  notes?: string
}

const VERIFIED_CLINICS: VetClinic[] = [
  {
    id: 'clinic-sp-01',
    name: 'Hospital Veterinário Sena Madureira 24h',
    is24h: true,
    speciesAttended: ['Cães', 'Gatos'],
    address: 'Rua Sena Madureira, 898 - Vila Clementino',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 5572-8777',
    distanceKm: 2.4,
    notes: 'Pronto-socorro 24h ininterrupto com UTI e centro cirúrgico de alta complexidade.',
  },
  {
    id: 'clinic-sp-02',
    name: 'Hospital Veterinário Anhembi Morumbi 24h',
    is24h: true,
    speciesAttended: ['Cães', 'Gatos', 'Aves', 'Silvestres'],
    address: 'Rua Conselheiro Lafaiete, 64 - Mooca',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 2790-4560',
    distanceKm: 4.8,
    notes: 'Atendimento de emergência 24h para cães, gatos e animais silvestres/não-convencionais.',
  },
  {
    id: 'clinic-sp-03',
    name: 'Centro Veterinário Seres (Petz) 24h',
    is24h: true,
    speciesAttended: ['Cães', 'Gatos'],
    address: 'Av. Presidente Castelo Branco, 1795 - Pari',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 3434-6980',
    distanceKm: 5.1,
    notes: 'Hospital veterinário completo 24 horas.',
  },
  {
    id: 'clinic-sp-04',
    name: 'Instituto de Aves & Animais Silvestres',
    is24h: false,
    speciesAttended: ['Aves', 'Coelhos', 'Roedores', 'Répteis'],
    address: 'Rua Tuim, 412 - Moema',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 5051-2233',
    distanceKm: 3.9,
    notes: 'Especializado em aves, lagomorfos e roedores. Atendimento emergencial sob plantão diurno.',
  },
]

export default function SosEmergencyPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [searchCity, setSearchCity] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState('all')

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo seu navegador.')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setLocating(false)
      },
      (err) => {
        console.warn('Erro ao obter localização:', err)
        alert('Não foi possível obter a localização automática. Você pode pesquisar por cidade ou endereço abaixo.')
        setLocating(false)
      }
    )
  }

  const filteredClinics = VERIFIED_CLINICS.filter((c) => {
    const matchesCity = !searchCity || c.city.toLowerCase().includes(searchCity.toLowerCase()) || c.address.toLowerCase().includes(searchCity.toLowerCase())
    const matchesSpecies = selectedSpecies === 'all' || c.speciesAttended.includes(selectedSpecies)
    return matchesCity && matchesSpecies
  })

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        {/* Red SOS Urgent Banner */}
        <div className="bg-[#C75B53] text-white rounded-3xl p-6 sm:p-8 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <ShieldAlert className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Zeludi SOS — Emergência Veterinária
                </h1>
                <p className="text-xs sm:text-sm text-white/90 mt-0.5">
                  Acesso rápido a hospitais veterinários e pronto-atendimento 24 horas.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locating}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-[#C75B53] font-bold text-xs hover:bg-white/90 transition-all shadow-sm shrink-0"
            >
              <Compass className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
              <span>{locating ? 'Localizando...' : 'Localização Atual'}</span>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20 flex items-start gap-2 text-xs text-white/90">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              <strong>Em situações graves</strong> (suspeita de intoxicação, convulsões, dificuldade respiratória ou atropelamento), não aguarde respostas virtuais: telefone imediatamente para a clínica e dirija-se ao local.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DCCBB5]/40 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#829B83] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por cidade, bairro ou rua..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
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
                <option value="all">Todas as espécies atendidas</option>
                <option value="Cães">Cães</option>
                <option value="Gatos">Gatos</option>
                <option value="Aves">Aves</option>
                <option value="Coelhos">Coelhos</option>
                <option value="Silvestres">Silvestres e Exóticos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clinics list */}
        <div className="space-y-4">
          {filteredClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-3xl p-6 border border-[#DCCBB5]/40 shadow-xs hover:border-[#829B83] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-[#354A3D]">
                    {clinic.name}
                  </h3>

                  {clinic.is24h ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C75B53] text-white flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Atendimento 24 Horas Confirmado
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF8F5] text-[#596B60] border border-[#DCCBB5]/40">
                      Horário comercial / plantão
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#596B60] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#829B83] shrink-0" />
                  <span>{clinic.address} • {clinic.city} - {clinic.state}</span>
                </p>

                {clinic.notes && (
                  <p className="text-xs text-[#87998F] leading-relaxed">
                    {clinic.notes}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                  <span className="text-[#596B60] font-medium">Espécies atendidas:</span>
                  {clinic.speciesAttended.map((sp) => (
                    <span
                      key={sp}
                      className="px-2 py-0.5 rounded-md bg-[#EEF3EF] text-[#354A3D] font-medium"
                    >
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Call and Maps */}
              <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                <a
                  href={`tel:${clinic.phone.replace(/\D/g, '')}`}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C75B53] text-white font-bold text-xs hover:bg-[#A94942] transition-all shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Ligar Agora ({clinic.phone})</span>
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    clinic.name + ' ' + clinic.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5] text-xs font-medium text-[#354A3D] hover:bg-white transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#829B83]" />
                  <span>Ver Rota no Mapa</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
