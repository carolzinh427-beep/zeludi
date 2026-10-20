'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { PawPrint, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, enableDemoMode, isConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    try {
      const res = await signIn(email, password)
      if (res.error) {
        setErrorMsg(res.error)
      } else {
        setSuccessMsg('Acesso autorizado! Redirecionando...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 600)
      }
    } catch {
      setErrorMsg('Falha ao autenticar. Verifique seus dados ou acesse no modo visitante.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemo = () => {
    enableDemoMode()
    router.push('/dashboard')
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
              Bem-vindo à Zeludi
            </h1>
            <p className="text-sm text-[#596B60] mt-1.5">
              Entre para acessar o histórico e os cuidados dos seus pets
            </p>
          </div>

          {!isConfigured && (
            <div className="mb-6 p-3.5 rounded-2xl bg-[#EEF3EF] border border-[#829B83]/30 text-xs text-[#354A3D]">
              <div className="flex items-start gap-2.5">
                <span className="text-base">💡</span>
                <div>
                  <p className="font-semibold text-[#354A3D]">Ambiente Local de Testes</p>
                  <p className="text-[#596B60] mt-0.5">
                    Você pode conectar seu Supabase no arquivo <code>.env.local</code> ou testar instantaneamente clicando abaixo.
                  </p>
                  <button
                    type="button"
                    onClick={handleQuickDemo}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#354A3D] text-white font-medium text-xs hover:bg-[#223229] transition-all"
                  >
                    <span>Entrar no Modo Demonstração</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

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

          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D]">
                  Senha
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#829B83] hover:text-[#354A3D] transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#829B83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#DCCBB5]/70 focus:outline-none focus:border-[#354A3D] text-sm bg-white text-[#354A3D]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-2xl bg-[#354A3D] text-white font-medium text-sm hover:bg-[#223229] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Entrando...' : 'Entrar na Plataforma'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#F5F1E8] text-center">
            <p className="text-xs text-[#596B60]">
              Ainda não tem conta?{' '}
              <Link
                href="/register"
                className="font-semibold text-[#354A3D] hover:underline"
              >
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
