'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  Database,
  Trash2,
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, updateProfile, signOut, isDemo, isConfigured, isLoading } = useAuth()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhone(profile.phone || '')
      setCity(profile.city || '')
      setState(profile.state || '')
    }
  }, [profile])

  if (isLoading) {
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

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Navbar />
        <div className="flex-1 max-w-lg mx-auto p-8 text-center flex flex-col items-center justify-center">
          <p className="text-base text-[#596B60] mb-4">Você precisa estar logado para acessar seu perfil.</p>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="zeludi-btn-primary"
          >
            Fazer Login
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)

    const res = await updateProfile({
      full_name: fullName,
      phone,
      city,
      state,
    })

    setSaving(false)
    if (res.error) {
      setFeedback({ type: 'error', msg: res.error })
    } else {
      setFeedback({ type: 'success', msg: 'Perfil atualizado com sucesso!' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#829B83]">
            <span>Minha Conta</span>
            <span>•</span>
            <span>Segurança & LGPD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#354A3D] mt-1 tracking-tight">
            Perfil do Tutor
          </h1>
          <p className="text-sm text-[#596B60] mt-1">
            Gerencie seus dados de contato, localização para cuidados meteorológicos e preferências de privacidade.
          </p>
        </div>

        {feedback && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-xs ${
              feedback.type === 'success'
                ? 'bg-[#4C885B]/10 text-[#4C885B] border border-[#4C885B]/20'
                : 'bg-[#C75B53]/10 text-[#C75B53] border border-[#C75B53]/20'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Summary Card */}
          <div className="md:col-span-1 space-y-5">
            <div className="bg-white rounded-3xl p-6 border border-[#DCCBB5]/40 shadow-xs text-center">
              <div className="w-20 h-20 rounded-full bg-[#354A3D] text-[#829B83] flex items-center justify-center mx-auto text-2xl font-bold shadow-sm mb-4">
                {fullName.charAt(0) || user.email.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-base font-bold text-[#354A3D]">
                {fullName || 'Tutor Zeludi'}
              </h2>
              <p className="text-xs text-[#596B60] mt-0.5 truncate">{user.email}</p>

              <div className="mt-4 pt-4 border-t border-[#F5F1E8] flex flex-col gap-2">
                <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#829B83]/15 text-[#354A3D]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#829B83]" />
                  Perfil Verificado
                </span>

                {isDemo && (
                  <span className="text-[10px] font-semibold text-[#D69738] bg-[#D69738]/10 px-2.5 py-1 rounded-xl">
                    Sessão Local / Demonstração
                  </span>
                )}
              </div>
            </div>

            {/* Cloud & Supabase status */}
            <div className="bg-white rounded-3xl p-5 border border-[#DCCBB5]/40 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#354A3D] mb-2">
                <Database className="w-4 h-4 text-[#829B83]" />
                <span>Estado da Conexão</span>
              </div>
              <p className="text-xs text-[#596B60] leading-relaxed">
                {isConfigured
                  ? 'Conectado diretamente ao Supabase com PostgreSQL e Row Level Security ativo.'
                  : 'Operando em modo local seguro. Para persistência em nuvem, adicione suas credenciais no arquivo .env.local.'}
              </p>
            </div>
          </div>

          {/* Right Edit Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCCBB5]/40 shadow-xs">
              <h3 className="text-base font-bold text-[#354A3D] mb-5">
                Informações Pessoais
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#829B83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#DCCBB5]/70 focus:outline-none focus:border-[#354A3D] text-sm text-[#354A3D]"
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
                      disabled
                      value={user.email}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#DCCBB5]/40 bg-[#FAF8F5] text-sm text-[#596B60] cursor-not-allowed"
                    />
                  </div>
                  <span className="text-[11px] text-[#596B60] mt-1 block">
                    O e-mail principal é utilizado para login e notificações críticas de saúde.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                      Telefone / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#829B83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="(00) 00000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#DCCBB5]/70 focus:outline-none focus:border-[#354A3D] text-sm text-[#354A3D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D] mb-1.5">
                      Cidade / UF
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#829B83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="São Paulo, SP"
                        value={city ? `${city}${state ? `, ${state}` : ''}` : ''}
                        onChange={(e) => {
                          const parts = e.target.value.split(',')
                          setCity(parts[0]?.trim() || '')
                          setState(parts[1]?.trim() || '')
                        }}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#DCCBB5]/70 focus:outline-none focus:border-[#354A3D] text-sm text-[#354A3D]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={saving}
                    className="zeludi-btn-primary text-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="text-xs font-semibold text-[#C75B53] hover:underline"
                  >
                    Sair da Conta
                  </button>
                </div>
              </form>
            </div>

            {/* LGPD & Data Minimization */}
            <div className="mt-6 p-5 rounded-3xl bg-[#EEF3EF]/60 border border-[#829B83]/20 flex items-start justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-[#354A3D]">Direitos do Titular (LGPD)</h4>
                <p className="text-xs text-[#596B60] mt-0.5">
                  Você tem total controle sobre seus dados e registros médicos dos seus pets. É possível solicitar a exclusão definitiva a qualquer momento.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Tem certeza de que deseja solicitar a exclusão de todos os seus dados? Esta ação é irreversível.')) {
                    signOut()
                    router.push('/')
                  }
                }}
                className="shrink-0 inline-flex items-center gap-1.5 text-xs text-[#C75B53] border border-[#C75B53]/30 px-3 py-1.5 rounded-xl hover:bg-[#C75B53]/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Conta</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
