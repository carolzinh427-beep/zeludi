'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { PawPrint, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp, isConfigured } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!agreeTerms) {
      setErrorMsg('Você precisa concordar com os Termos de Uso e Política de Privacidade.')
      return
    }

    if (password.length < 6) {
      setErrorMsg('A senha precisa ter no mínimo 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      const res = await signUp(email, password, fullName)
      if (res.error) {
        setErrorMsg(res.error)
      } else {
        setSuccessMsg(
          isConfigured
            ? 'Cadastro realizado com sucesso! Verifique seu e-mail ou faça login.'
            : 'Conta criada localmente! Redirecionando para o painel...'
        )
        setTimeout(() => {
          router.push('/dashboard')
        }, 800)
      }
    } catch {
      setErrorMsg('Ocorreu um erro ao criar a conta. Tente novamente.')
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
              Criar Conta na Zeludi
            </h1>
            <p className="text-sm text-[#596B60] mt-1.5">
              Cada pet é único. Comece a cuidar hoje mesmo com inteligência e carinho.
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

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                Nome Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#829B83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Dra. Juliana Santos"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#DCCBB5]/70 focus:outline-none focus:border-[#354A3D] text-sm bg-white text-[#354A3D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                E-mail
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#829B83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#DCCBB5]/70 focus:outline-none focus:border-[#354A3D] text-sm bg-white text-[#354A3D]"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-[#596B60] cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#DCCBB5] text-[#354A3D] focus:ring-[#829B83]"
                />
                <span>
                  Li e concordo com os{' '}
                  <Link href="/terms" className="text-[#354A3D] underline">
                    Termos de Uso
                  </Link>{' '}
                  e com a{' '}
                  <Link href="/privacy" className="text-[#354A3D] underline">
                    Política de Privacidade (LGPD)
                  </Link>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-2xl bg-[#354A3D] text-white font-medium text-sm hover:bg-[#223229] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Criando conta...' : 'Concluir Cadastro'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#F5F1E8] text-center">
            <p className="text-xs text-[#596B60]">
              Já possui uma conta?{' '}
              <Link
                href="/login"
                className="font-semibold text-[#354A3D] hover:underline"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
