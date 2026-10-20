import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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
              Privacidade & Segurança
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#354A3D] mt-1">
              Política de Privacidade (LGPD)
            </h1>
            <p className="text-xs text-[#87998F] mt-1">
              Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#354A3D]">1. Princípios e Compromisso</h2>
            <p>
              A Zeludi prioriza a confidencialidade e a segurança das informações dos tutores e de seus animais. Tratamos os dados sob os princípios de finalidade, necessidade, transparência e segurança.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#354A3D]">2. Dados Pessoais Coletados</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Identificação do Tutor:</strong> Nome completo, endereço de e-mail e telefone de contato.</li>
              <li><strong>Localização aproximada (Cidade/UF ou coordenadas com consentimento):</strong> Utilizada exclusivamente para cálculo das condições meteorológicas locais e recomendações térmicas do Zeludi Clima.</li>
              <li><strong>Ficha dos Animais:</strong> Espécie, nome, idade, raça, porte, pelagem, dieta, condições médicas e vacinas registradas.</li>
              <li><strong>Logs de Auditoria e Segurança:</strong> Registros técnicos para prevenção de fraudes e proteção contra acessos indevidos.</li>
            </ul>
          </section>

          <section className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40">
            <div className="flex items-start gap-2.5">
              <Lock className="w-5 h-5 text-[#829B83] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-[#354A3D]">3. Isolamento e Row Level Security (RLS)</h3>
                <p className="text-xs mt-1 text-[#596B60]">
                  Garantimos que cada tutor acesse exclusivamente os seus animais e registros através de políticas de banco de dados Row Level Security (RLS) no nível do PostgreSQL. Nenhum usuário ou terceiro possui acesso cruzado a informações privadas sem autorização explícita.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#354A3D]">4. Não Comercialização de Dados</h2>
            <p>
              A Zeludi nunca vende nem comercializa cadastros de tutores ou prontuários dos animais para empresas terceiras, operadoras de planos de saúde pet ou anunciantes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#354A3D]">5. Seus Direitos (Artigo 18 da LGPD)</h2>
            <p>
              Você pode, a qualquer momento na aba Perfil ou pelo canal de suporte:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Confirmar a existência de tratamento e acessar seus dados.</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
              <li>Solicitar a eliminação completa e irrevogável de seus dados cadastrais e fichas dos animais.</li>
              <li>Revogar o consentimento para notificações e alertas.</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
