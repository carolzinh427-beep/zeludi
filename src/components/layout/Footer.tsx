'use client'

import React from 'react'
import Link from 'next/link'
import { PawPrint, Heart, ShieldCheck, Stethoscope } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#354A3D] text-[#F5F1E8] border-t border-[#829B83]/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#829B83] flex items-center justify-center text-[#F5F1E8]">
                <PawPrint className="w-5 h-5 text-[#354A3D]" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#F5F1E8]">
                zeludi
              </span>
            </div>
            <p className="text-sm text-[#DCCBB5] max-w-md leading-relaxed">
              Cada pet é único. Cada cuidado importa. A plataforma inteligente que une ciência do bem-estar animal, dados climáticos locais e acompanhamento preventivo contínuo para cães, gatos, aves e animais não-convencionais.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#829B83]">
              <ShieldCheck className="w-4 h-4 text-[#829B83]" />
              <span>Conformidade com a LGPD e privacidade de dados veterinários</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#829B83] mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm text-[#DCCBB5]">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Painel Principal
                </Link>
              </li>
              <li>
                <Link href="/pets" className="hover:text-white transition-colors">
                  Meus Pets Cadastrados
                </Link>
              </li>
              <li>
                <Link href="/health" className="hover:text-white transition-colors">
                  Calendário de Vacinas & Saúde
                </Link>
              </li>
              <li>
                <Link href="/weather" className="hover:text-white transition-colors">
                  Zeludi Clima & Conforto Térmico
                </Link>
              </li>
              <li>
                <Link href="/ai" className="hover:text-white transition-colors">
                  Zeludi IA Assistente
                </Link>
              </li>
              <li>
                <Link href="/sos" className="hover:text-white text-[#C75B53] font-semibold transition-colors flex items-center gap-1">
                  <span>Emergência Zeludi SOS</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Disclaimer */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#829B83] mb-4">
              Privacidade & Ética
            </h4>
            <ul className="space-y-2.5 text-sm text-[#DCCBB5]">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Política de Privacidade (LGPD)
                </Link>
              </li>
              <li>
                <span className="text-xs text-[#DCCBB5]/70 block pt-1">
                  Espécies suportadas: Cães, Gatos, Aves, Coelhos, Hamsters, Porquinhos-da-Índia e outros.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethical Veterinary Disclaimer */}
        <div className="mt-12 pt-6 border-t border-[#829B83]/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#DCCBB5]/80">
          <div className="flex items-start gap-2 max-w-3xl">
            <Stethoscope className="w-4 h-4 text-[#829B83] shrink-0 mt-0.5" />
            <p>
              <strong>Aviso Veterinário Responsável:</strong> As orientações, análises climáticas e assistentes virtuais da Zeludi possuem finalidade exclusivamente preventiva e educativa. Não substituem o diagnóstico presencial, exames laboratoriais ou prescrição clínica de um médico-veterinário devidamente registrado no CRMV.
            </p>
          </div>
          <p className="shrink-0 text-center md:text-right">
            © 2026 Zeludi. Feito com <Heart className="w-3.5 h-3.5 inline text-[#C75B53] fill-current" /> para quem ama pets.
          </p>
        </div>
      </div>
    </footer>
  )
}
