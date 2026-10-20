'use client'

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import type { Profile, UserRole } from '@/types/database.types'

interface AuthContextType {
  user: { id: string; email: string } | null
  profile: Profile | null
  isLoading: boolean
  isConfigured: boolean
  isDemo: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<{ error?: string }>
  enableDemoMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'
const DEMO_STORAGE_KEY = 'zeludi_demo_session'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConfigured] = useState(isSupabaseConfigured())
  const [isDemo, setIsDemo] = useState(false)
  const [, startTransition] = useTransition()

  // Initialize Auth state
  useEffect(() => {
    let mounted = true

    async function initAuth() {
      try {
        if (!isConfigured) {
          // Check local storage for demo session
          const stored = typeof window !== 'undefined' ? localStorage.getItem(DEMO_STORAGE_KEY) : null
          if (stored) {
            const parsed = JSON.parse(stored)
            if (mounted) {
              setUser(parsed.user)
              setProfile(parsed.profile)
              setIsDemo(true)
            }
          }
          if (mounted) setIsLoading(false)
          return
        }

        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user && mounted) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? '',
          })

          // Fetch user profile from database
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (userProfile && mounted) {
            setProfile(userProfile as Profile)
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    initAuth()

    if (isConfigured) {
      const supabase = createClient()
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? '',
          })
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (userProfile && mounted) {
            setProfile(userProfile as Profile)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
        setIsLoading(false)
      })

      return () => {
        mounted = false
        subscription.unsubscribe()
      }
    }

    return () => {
      mounted = false
    }
  }, [isConfigured])

  const enableDemoMode = () => {
    const demoProfile: Profile = {
      id: DEMO_USER_ID,
      full_name: 'Dra. Sofia Mendes (Tutora & Vet)',
      email: 'sofia.zeludi@exemplo.com',
      phone: '(11) 98765-4321',
      avatar_url: null,
      role: 'tutor' as UserRole,
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.55052,
      longitude: -46.633308,
      terms_accepted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const demoUser = { id: DEMO_USER_ID, email: demoProfile.email }

    setUser(demoUser)
    setProfile(demoProfile)
    setIsDemo(true)

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        DEMO_STORAGE_KEY,
        JSON.stringify({ user: demoUser, profile: demoProfile })
      )
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isConfigured) {
      // Local fallback mode
      const newProfile: Profile = {
        id: 'user_' + Date.now(),
        full_name: fullName,
        email,
        phone: null,
        avatar_url: null,
        role: 'tutor' as UserRole,
        city: 'São Paulo',
        state: 'SP',
        latitude: null,
        longitude: null,
        terms_accepted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const newUser = { id: newProfile.id, email }
      setUser(newUser)
      setProfile(newProfile)
      setIsDemo(true)
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ user: newUser, profile: newProfile }))
      return {}
    }

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email ?? email })
    }

    return {}
  }

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      enableDemoMode()
      return {}
    }

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email ?? email })
    }

    return {}
  }

  const signOut = async () => {
    startTransition(async () => {
      if (isConfigured) {
        const supabase = createClient()
        await supabase.auth.signOut()
      }
      setUser(null)
      setProfile(null)
      setIsDemo(false)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(DEMO_STORAGE_KEY)
      }
    })
  }

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return { error: 'Usuário não autenticado' }

    if (!isConfigured || isDemo) {
      const updated = { ...profile, ...data, updated_at: new Date().toISOString() } as Profile
      setProfile(updated)
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ user, profile: updated }))
      }
      return {}
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)

    if (error) {
      return { error: error.message }
    }

    setProfile((prev) => (prev ? ({ ...prev, ...data } as Profile) : null))
    return {}
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isConfigured,
        isDemo,
        signUp,
        signIn,
        signOut,
        updateProfile,
        enableDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
