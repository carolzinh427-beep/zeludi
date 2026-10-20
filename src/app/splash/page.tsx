'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { SplashScreen } from '@/components/splash/SplashScreen'
import { useAuth } from '@/context/AuthContext'

export default function SplashPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleComplete = () => {
    // Redireciona diretamente para o site sem intermediários
    router.push(user ? '/dashboard' : '/')
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <SplashScreen forceFull={true} onComplete={handleComplete} />
    </div>
  )
}
