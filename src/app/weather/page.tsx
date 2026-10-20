'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { fetchCurrentWeather, type WeatherData } from '@/services/weatherService'
import {
  CloudSun,
  Droplets,
  Wind,
  Sun,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Compass,
  CheckCircle2,
  PawPrint,
  Info,
} from 'lucide-react'

export default function WeatherModulePage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await fetchCurrentWeather(-23.55052, -46.633308, 'São Paulo')
      setWeather(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#829B83]">
            <CloudSun className="w-4 h-4 text-[#829B83]" />
            <span>Zeludi Clima</span>
            <span>•</span>
            <span>Conforto Ambiental</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#354A3D] mt-1 tracking-tight">
            Módulo de Cuidados Meteorológicos
          </h1>
          <p className="text-sm text-[#596B60] mt-1">
            Regras de segurança térmica e ambiental calibradas pela espécie, pelagem e biologia animal.
          </p>
        </div>

        {loading || !weather ? (
          <div className="py-20 text-center text-xs text-[#596B60]">
            Obtendo dados meteorológicos de precisão...
          </div>
        ) : (
          <div className="space-y-8">
            {/* Live Metrics Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCCBB5]/40 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#F5F1E8] pb-6 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#829B83]">
                    Local de Medição Atual
                  </span>
                  <h2 className="text-xl font-bold text-[#354A3D]">
                    {weather.city} • Dados em Tempo Real (Open-Meteo)
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#354A3D] bg-[#EEF3EF] px-3.5 py-1.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4C885B]" />
                  <span>Fonte de Satélite Ativa</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40 text-center">
                  <span className="text-xs text-[#596B60] uppercase block">Temperatura</span>
                  <p className="text-3xl font-black text-[#354A3D] mt-1">
                    {weather.temperature}°C
                  </p>
                  <span className="text-[11px] text-[#87998F]">
                    Sensação: {weather.apparentTemperature}°C
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40 text-center">
                  <span className="text-xs text-[#596B60] uppercase block">Umidade Relativa</span>
                  <p className="text-3xl font-black text-[#354A3D] mt-1">
                    {weather.humidity}%
                  </p>
                  <span className="text-[11px] text-[#87998F]">
                    {weather.humidity < 40 ? 'Ar ressecado' : 'Confortável'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40 text-center">
                  <span className="text-xs text-[#596B60] uppercase block">Velocidade do Vento</span>
                  <p className="text-3xl font-black text-[#354A3D] mt-1">
                    {weather.windSpeed} km/h
                  </p>
                  <span className="text-[11px] text-[#87998F]">Brisa natural</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40 text-center">
                  <span className="text-xs text-[#596B60] uppercase block">Condição Céu</span>
                  <p className="text-sm font-bold text-[#354A3D] mt-2">
                    {weather.conditionText}
                  </p>
                  <span className="text-[11px] text-[#87998F]">Atualizado recentemente</span>
                </div>
              </div>
            </div>

            {/* Species Specific Thresholds Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dogs Walk Advisory */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCBB5]/40 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐕</span>
                  <div>
                    <h3 className="text-base font-bold text-[#354A3D]">
                      Cães — Janelas Seguras de Passeio
                    </h3>
                    <p className="text-xs text-[#596B60]">Proteção dos coxins e hipertermia</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#EEF3EF] border border-[#829B83]/30 text-xs space-y-2">
                  <p className="font-bold text-[#354A3D] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#829B83]" />
                    <span>Horários Recomendados para Hoje:</span>
                  </p>
                  <p className="text-[#596B60] leading-relaxed">
                    • Manhã: até às <strong>08h30</strong>
                    <br />
                    • Tarde/Noite: a partir das <strong>18h00</strong>
                    <br />
                    • Evite caminhadas sob sol direto entre 10h e 16h. O asfalto absorve calor e pode atingir 50°C mesmo em dias com 28°C de temperatura ambiente.
                  </p>
                </div>
              </div>

              {/* Rabbits & Small Rodents Advisory */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCBB5]/40 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐇</span>
                  <div>
                    <h3 className="text-base font-bold text-[#354A3D]">
                      Coelhos & Roedores — Tolerância Térmica
                    </h3>
                    <p className="text-xs text-[#596B60]">Limites estreitos de homeostase</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40 text-xs space-y-2">
                  <p className="font-bold text-[#354A3D] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#D69738]" />
                    <span>Atenção aos 26°C - 28°C:</span>
                  </p>
                  <p className="text-[#596B60] leading-relaxed">
                    Coelhos não suam nem ofegam com a mesma eficácia que cães. Temperaturas sustentadas acima de 27°C são perigosas. Garanta circulação suave de ar e placas de cerâmica/porcelanato frescas.
                  </p>
                </div>
              </div>

              {/* Birds Advisory */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCBB5]/40 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🦜</span>
                  <div>
                    <h3 className="text-base font-bold text-[#354A3D]">
                      Aves & Silvestres — Correntes de Ar
                    </h3>
                    <p className="text-xs text-[#596B60]">Sensibilidade das vias aéreas</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40 text-xs space-y-2">
                  <p className="text-[#596B60] leading-relaxed">
                    Aves possuem sistema de sacos aéreos altamente especializado. Nunca posicione viveiros no caminho direto de ventiladores, aparelhos de ar-condicionado ou correntes de vento frio de janelas.
                  </p>
                </div>
              </div>

              {/* Cats Advisory */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCCBB5]/40 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐈</span>
                  <div>
                    <h3 className="text-base font-bold text-[#354A3D]">
                      Gatos — Hidratação Preventiva
                    </h3>
                    <p className="text-xs text-[#596B60]">Proteção das vias urinárias</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#EEF3EF] border border-[#829B83]/30 text-xs space-y-2">
                  <p className="text-[#596B60] leading-relaxed">
                    Com a umidade em {weather.humidity}%, felinos necessitam de estímulo ativo à ingestão de água. Distribua mais potes de cerâmica ou inox e ofereça sachês com alto teor de umidade para prevenir cristais urinários.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
