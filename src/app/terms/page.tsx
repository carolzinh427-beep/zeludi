import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ShieldCheck, Stethoscope, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#596B60] hover:text-[#354A3D] mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar à página inicial</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#DCCBB5]/40 shadow-xs space-y-6 text-sm text-[#596B60] leading-relaxed">
          <div className="border-b border-[#F5F1E8] pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#829B83]">
              Termos & Condições
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#354A3D] mt-1">
              Termos de Uso da Zeludi
            </h1>
            <p className="text-xs text-[#87998F] mt-1">
              Última atualização: 20 de outubro de 2026 • Versão 1.0
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#354A3D]">1. Visão Geral da Plataforma</h2>
            <p>
              A Zeludi é uma plataforma digital dedicada ao auxílio de tutores e cuidadores no registro, organização e acompanhamento de cuidados preventivos, rotinas e bem-estar de animais de estimação de diversas espécies.
            </p>
          </section>

          <section className="space-y-3 p-4 rounded-2xl bg-[#EEF3EF] border border-[#829B83]/30 text-[#354A3D]">
            <div className="flex items-start gap-2.5">
              <Stethoscope className="w-5 h-5 text-[#829B83] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm">2. Limitação de Responsabilidade Veterinária</h3>
                <p className="text-xs mt-1 leading-relaxed text-[#596B60]">
                  <strong>A Zeludi NÃO substitui a consulta veterinária presencial, exames laboratoriais ou diagnósticos clínicos.</strong> Todas as recomendações de conforto térmico, nutrição, rotinas e respostas fornecidas pela inteligência artificial têm caráter puramente informativo e preventivo. Em casos de suspeita de intoxicação, colapso, dor aguda ou risco de vida, dirija-se imediatamente a uma clínica ou hospital veterinário.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#354A3D]">3. Cadastro e Segurança de Acesso</h2>
            <p>
              O usuário se compromete a fornecer informações verdadeiras e atualizadas. A segurança das credenciais de acesso é de responsabilidade individual. A Zeludi adota controles de autenticação e criptografia de ponta a ponta com Row Level Security (RLS) para garantir o isolamento estrito dos dados entre tutores.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#354A3D]">4. Propriedade Intelectual e Uso Adequado</h2>
            <p>
              O software, marcas, bases de conhecimento curadas e interfaces são de propriedade exclusiva da Zeludi. É proibida a extração automatizada não autorizada (scraping) ou reprodução comercial dos algoritmos e dados da plataforma.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#354A3D]">5. Modificações e Encerramento</h2>
            <p>
              Reservamo-nos o direito de aprimorar continuamente as funcionalidades da plataforma. Os usuários serão informados de atualizações relevantes nos termos através de aviso in-app ou por e-mail cadastrado.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
