'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  PawPrint,
  HeartPulse,
  Sparkles,
  CloudSun,
  ShieldAlert,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  PlusCircle,
  Utensils,
} from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const { user, profile, isDemo, signOut, enableDemoMode } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const navLinks = [
    { href: '/dashboard', label: 'Painel', icon: Sparkles },
    { href: '/pets', label: 'Meus Pets', icon: PawPrint },
    { href: '/health', label: 'Saúde & Vacinas', icon: HeartPulse },
    { href: '/food', label: 'Nutrição & Petiscos', icon: Utensils },
    { href: '/weather', label: 'Zeludi Clima', icon: CloudSun },
    { href: '/ai', label: 'Zeludi IA', icon: Sparkles },
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') return true
    if (path !== '/dashboard' && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#DCCBB5]/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#354A3D] flex items-center justify-center text-[#F5F1E8] shadow-sm group-hover:bg-[#223229] transition-colors">
              <PawPrint className="w-5 h-5 text-[#829B83]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-[#354A3D]">
                zeludi
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-[#829B83] -mt-1">
                cuidado inteligente
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#354A3D] text-[#FFFFFF] shadow-xs'
                      : 'text-[#354A3D] hover:bg-[#EEF3EF] hover:text-[#223229]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#829B83]' : 'text-[#829B83]'}`} />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Zeludi SOS Emergency button */}
            <Link
              href="/sos"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#C75B53]/10 text-[#C75B53] border border-[#C75B53]/30 hover:bg-[#C75B53] hover:text-white transition-all shadow-xs"
              title="Acesso rápido a clínicas 24h e emergências veterinárias"
            >
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>Zeludi SOS</span>
            </Link>

            {/* User Account / Profile */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[#DCCBB5]/60 hover:border-[#829B83] bg-white text-sm font-medium text-[#354A3D] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#829B83]/20 flex items-center justify-center text-[#354A3D]">
                    <User className="w-4 h-4 text-[#354A3D]" />
                  </div>
                  <span className="max-w-[120px] truncate">
                    {profile?.full_name ? profile.full_name.split(' ')[0] : 'Minha Conta'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#596B60]" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#DCCBB5]/50 py-2 z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#F5F1E8]">
                      <p className="text-xs text-[#596B60]">Conectado como</p>
                      <p className="text-sm font-semibold text-[#354A3D] truncate">
                        {profile?.full_name || user.email}
                      </p>
                      {isDemo && (
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#D69738]/15 text-[#D69738]">
                          Modo Demonstração
                        </span>
                      )}
                    </div>

                    <Link
                      href="/pets/new"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#354A3D] hover:bg-[#EEF3EF] transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-[#829B83]" />
                      Cadastrar novo Pet
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#354A3D] hover:bg-[#EEF3EF] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#829B83]" />
                      Meu Perfil & Preferências
                    </Link>

                    <div className="border-t border-[#F5F1E8] my-1" />

                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-[#C75B53] hover:bg-[#C75B53]/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair da conta
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={enableDemoMode}
                  className="text-xs font-semibold text-[#354A3D] bg-[#EEF3EF] hover:bg-[#DCCBB5]/40 px-3 py-2 rounded-xl transition-colors"
                >
                  Entrar como Visitante
                </button>
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#354A3D] hover:text-[#223229] px-3 py-2 rounded-xl"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="zeludi-btn-primary text-xs px-4 py-2 rounded-xl"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/sos"
              className="p-2 rounded-xl bg-[#C75B53]/10 text-[#C75B53] border border-[#C75B53]/30"
              title="Emergência SOS"
            >
              <ShieldAlert className="w-5 h-5" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#354A3D] hover:bg-[#EEF3EF]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DCCBB5]/40 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                  active
                    ? 'bg-[#354A3D] text-[#FFFFFF]'
                    : 'text-[#354A3D] hover:bg-[#EEF3EF]'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#829B83]' : 'text-[#829B83]'}`} />
                {link.label}
              </Link>
            )
          })}

          <div className="pt-4 border-t border-[#F5F1E8] space-y-2">
            {user ? (
              <>
                <Link
                  href="/pets/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#354A3D] bg-[#EEF3EF]"
                >
                  <PlusCircle className="w-4 h-4 text-[#829B83]" />
                  Cadastrar novo Pet
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#354A3D]"
                >
                  <User className="w-4 h-4 text-[#829B83]" />
                  Meu Perfil ({profile?.full_name || user.email})
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#C75B53]"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-[#DCCBB5] text-sm font-medium text-[#354A3D]"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-[#354A3D] text-white text-sm font-medium"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
