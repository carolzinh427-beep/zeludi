'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { SplashScreen } from '@/components/splash/SplashScreen'
import { RotateCcw, ArrowRight, Sparkles, PawPrint } from 'lucide-react'

export default function SplashPreviewPage() {
  const [key, setKey] = useState(1)
  const [finished, setFinished] = useState(false)

  const handleRestart = () => {
    setFinished(false)
    setKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col items-center justify-center p-6 text-center">
      {/* Animated Splash Screen Component */}
      {!finished && (
        <SplashScreen
          key={key}
          forceFull={true}
          onComplete={() => setFinished(true)}
        />
      )}

      {/* Screen shown when the animation finishes or if previewing controls */}
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#DCCBB5]/40 shadow-sm space-y-6 animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-[#354A3D] text-[#829B83] flex items-center justify-center mx-auto">
          <PawPrint className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#354A3D] tracking-tight">
            Abertura Zeludi Concluída
          </h1>
          <p className="text-xs text-[#596B60] mt-1.5 leading-relaxed">
            A animação representou a transformação contínua de:
            <br />
            <strong>Cão ➔ Pássaro ➔ Gato ➔ Hamster ➔ Águia ➔ Logotipo Zeludi</strong>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/40 text-xs text-[#354A3D] space-y-1 text-left">
          <p className="font-bold flex items-center gap-1.5 text-[#354A3D]">
            <Sparkles className="w-4 h-4 text-[#829B83]" />
            <span>Detalhes da Identidade:</span>
          </p>
          <p className="text-[#596B60] text-[11px] leading-relaxed">
            • O pingo do &quot;i&quot; da palavra <strong>zeludi</strong> é uma patinha delicada integrada diretamente ao vetor.
            <br />
            • Paleta oficial: Creme (#F5F1E8), Floresta (#354A3D) e Sálvia (#829B83).
            <br />
            • Transições fluidas em SVG nativo e partículas dinâmicas no Canvas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleRestart}
            className="w-full sm:w-auto flex-1 zeludi-btn-secondary text-xs py-3"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Assistir Novamente</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto flex-1 zeludi-btn-primary text-xs py-3"
          >
            <span>Ir para o App</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
