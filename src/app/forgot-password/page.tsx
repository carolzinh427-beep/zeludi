'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { PawPrint, Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)
    setLoading(true)

    try {
      if (!isSupabaseConfigured()) {
        setSuccessMsg(
          'No modo local ou de teste, o link de recuperação foi simulado. No ambiente conectado com Supabase, um e-mail real será enviado.'
        )
        return
      }

      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setErrorMsg(error.message)
      } else {
        setSuccessMsg('Enviamos um link de recuperação para o seu e-mail!')
      }
    } catch {
      setErrorMsg('Falha ao solicitar recuperação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#DCCBB5]/40">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#354A3D] text-[#829B83] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <PawPrint className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#354A3D] tracking-tight">
              Recuperar Senha
            </h1>
            <p className="text-sm text-[#596B60] mt-1.5">
              Digite seu e-mail para receber as instruções de redefinição
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

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#829B83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#DCCBB5]/70 focus:outline-none focus:border-[#354A3D] text-sm bg-white text-[#354A3D]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-2xl bg-[#354A3D] text-white font-medium text-sm hover:bg-[#223229] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#F5F1E8] text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#596B60] hover:text-[#354A3D]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar para o Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
