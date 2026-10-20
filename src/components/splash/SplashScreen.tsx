'use client'

import React, { useState, useEffect, useRef } from 'react'
import { PawPrint, X } from 'lucide-react'

interface SplashScreenProps {
  onComplete?: () => void
  forceFull?: boolean
}

type AnimalStage = 'dog' | 'bird' | 'cat' | 'hamster' | 'eagle' | 'dissolve' | 'logo' | 'finished'

export function SplashScreen({ onComplete, forceFull = false }: SplashScreenProps) {
  const [stage, setStage] = useState<AnimalStage>('dog')
  const [progress, setProgress] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Control timing
  useEffect(() => {
    const isReturningUser = !forceFull && typeof window !== 'undefined' && localStorage.getItem('zeludi_seen_splash') === 'true'
    
    // Timing intervals (ms)
    const stageDuration = isReturningUser ? 600 : 1100

    const timeouts: NodeJS.Timeout[] = []

    timeouts.push(setTimeout(() => setStage('bird'), stageDuration * 1))
    timeouts.push(setTimeout(() => setStage('cat'), stageDuration * 2))
    timeouts.push(setTimeout(() => setStage('hamster'), stageDuration * 3))
    timeouts.push(setTimeout(() => setStage('eagle'), stageDuration * 4))
    timeouts.push(setTimeout(() => setStage('dissolve'), stageDuration * 5))
    timeouts.push(setTimeout(() => setStage('logo'), stageDuration * 5.7))

    const totalDuration = stageDuration * 7.5
    timeouts.push(
      setTimeout(() => {
        setIsFadingOut(true)
        setTimeout(() => {
          setStage('finished')
          if (typeof window !== 'undefined') {
            localStorage.setItem('zeludi_seen_splash', 'true')
          }
          if (onComplete) onComplete()
        }, 700)
      }, totalDuration)
    )

    // Progress bar animation
    const startTime = Date.now()
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100))
      setProgress(pct)
      if (pct >= 100) clearInterval(progressInterval)
    }, 40)

    return () => {
      timeouts.forEach(clearTimeout)
      clearInterval(progressInterval)
    }
  }, [forceFull, onComplete])

  // Canvas particle background simulation (floating organic sage & sand spores)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Particle pool
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1.2,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8 - 0.3,
      alpha: Math.random() * 0.45 + 0.15,
      color: Math.random() > 0.5 ? '#829B83' : '#DCCBB5',
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Soft center glowing radial gradient
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.55
      )
      gradient.addColorStop(0, 'rgba(238, 243, 239, 0.85)')
      gradient.addColorStop(0.6, 'rgba(245, 241, 232, 0.95)')
      gradient.addColorStop(1, '#F5F1E8')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Draw floating particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })
      ctx.globalAlpha = 1

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const handleSkip = () => {
    setIsFadingOut(true)
    setTimeout(() => {
      setStage('finished')
      if (typeof window !== 'undefined') {
        localStorage.setItem('zeludi_seen_splash', 'true')
      }
      if (onComplete) onComplete()
    }, 400)
  }

  if (stage === 'finished') return null

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 select-none transition-opacity duration-700 bg-[#F5F1E8] ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Top Header: Brand mark + Skip button */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#829B83]">
          <PawPrint className="w-4 h-4 text-[#829B83]" />
          <span>Zeludi Experience</span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="text-xs font-medium text-[#596B60] hover:text-[#354A3D] bg-white/70 hover:bg-white backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#DCCBB5]/60 transition-all flex items-center gap-1.5 shadow-xs"
        >
          <span>Pular</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Animated Stage */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        {/* Luminous Organic Circle Frame */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full flex items-center justify-center">
          {/* Pulsing ring aura */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#829B83]/20 via-[#DCCBB5]/30 to-[#354A3D]/10 blur-xl animate-pulse" />
          <div className="absolute inset-4 rounded-full border border-[#829B83]/30 bg-white/40 backdrop-blur-xs shadow-inner" />

          {/* Morphing Animal Silhouettes */}
          <div className="relative w-52 h-52 flex items-center justify-center">
            {/* 1. DOG */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                stage === 'dog'
                  ? 'opacity-100 scale-100 translate-y-0 rotate-0'
                  : 'opacity-0 scale-75 -translate-y-3 pointer-events-none'
              }`}
            >
              <svg
                viewBox="0 0 200 200"
                className="w-44 h-44 drop-shadow-md text-[#354A3D] fill-current"
              >
                {/* Elegant Retriever Dog Silhouette */}
                <g>
                  {/* Body & Chest */}
                  <path d="M78 170 C78 170, 75 125, 92 110 C100 102, 115 105, 125 118 C136 132, 138 170, 138 170 Z" />
                  {/* Legs */}
                  <path d="M75 160 C75 160, 72 182, 80 185 C87 187, 92 178, 92 165 Z" />
                  <path d="M124 165 C124 178, 128 187, 135 185 C142 182, 140 160, 140 160 Z" />
                  {/* Back & Tail */}
                  <path
                    d="M135 150 C145 142, 160 135, 168 122 C172 115, 172 110, 166 112 C158 116, 148 126, 138 138 Z"
                    className="origin-bottom-left animate-wiggle"
                  />
                  {/* Neck & Head */}
                  <path d="M92 110 C92 100, 96 82, 100 70 C102 65, 108 60, 116 62 C124 64, 126 72, 128 85 C128 95, 122 108, 116 114 Z" />
                  {/* Snout & Muzzle */}
                  <path d="M100 70 C95 70, 75 75, 70 82 C68 85, 72 90, 80 90 C88 90, 98 84, 100 78 Z" />
                  {/* Nose */}
                  <circle cx="70" cy="80" r="3.5" fill="#829B83" />
                  {/* Ear */}
                  <path
                    d="M116 62 C122 62, 132 75, 130 96 C128 102, 122 104, 120 98 C118 88, 116 75, 114 65 Z"
                    fill="#28392F"
                  />
                  {/* Gentle Eye */}
                  <circle cx="95" cy="73" r="2.5" fill="#F5F1E8" />
                </g>
              </svg>
            </div>

            {/* 2. BIRD */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                stage === 'bird'
                  ? 'opacity-100 scale-100 translate-y-0 rotate-0'
                  : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
              }`}
            >
              <svg
                viewBox="0 0 200 200"
                className="w-44 h-44 drop-shadow-md text-[#354A3D] fill-current animate-pulse-gentle"
              >
                {/* Graceful Bird in Flight */}
                <g>
                  {/* Body */}
                  <path d="M85 105 C95 95, 115 95, 130 108 C140 117, 145 130, 155 140 C145 136, 130 128, 118 124 C105 120, 92 118, 85 105 Z" />
                  {/* Head & Beak */}
                  <path d="M85 105 C80 100, 75 92, 78 85 C82 78, 90 80, 95 86 C98 90, 98 96, 92 102 Z" />
                  <path d="M75 87 L62 90 L74 93 Z" fill="#829B83" />
                  {/* Eye */}
                  <circle cx="82" cy="86" r="2" fill="#F5F1E8" />
                  {/* Crest / Feathers */}
                  <path d="M82 79 C82 72, 88 68, 89 65 C88 72, 86 76, 85 80 Z" fill="#829B83" />
                  {/* Upward Flapping Wing */}
                  <path
                    d="M102 98 C102 98, 115 60, 138 45 C146 40, 148 46, 142 54 C134 65, 126 80, 120 98 Z"
                    fill="#28392F"
                  />
                  {/* Secondary Wing */}
                  <path
                    d="M110 102 C110 102, 128 75, 155 64 C160 62, 160 68, 154 74 C142 86, 132 98, 124 105 Z"
                    fill="#354A3D"
                  />
                  {/* Tail Feathers */}
                  <path d="M145 132 L172 155 L158 142 L168 162 L148 138 Z" fill="#829B83" />
                </g>
              </svg>
            </div>

            {/* 3. CAT */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                stage === 'cat'
                  ? 'opacity-100 scale-100 translate-y-0 rotate-0'
                  : 'opacity-0 scale-90 translate-y-3 pointer-events-none'
              }`}
            >
              <svg
                viewBox="0 0 200 200"
                className="w-44 h-44 drop-shadow-md text-[#354A3D] fill-current"
              >
                {/* Elegant Sitting Cat Silhouette */}
                <g>
                  {/* Body */}
                  <path d="M85 170 C85 140, 95 120, 105 105 C115 115, 125 140, 125 170 Z" />
                  {/* Flank and curved rear leg */}
                  <path d="M115 140 C130 145, 140 155, 140 170 C140 175, 110 175, 105 170 Z" />
                  {/* Paws */}
                  <ellipse cx="94" cy="172" rx="7" ry="4" fill="#28392F" />
                  <ellipse cx="110" cy="172" rx="7" ry="4" fill="#28392F" />
                  {/* Elegant Curving Tail */}
                  <path
                    d="M135 168 C155 168, 168 155, 168 140 C168 130, 160 128, 158 134 C158 142, 150 155, 132 158 Z"
                    fill="#829B83"
                  />
                  {/* Head */}
                  <circle cx="105" cy="85" r="22" />
                  {/* Pointed Ears */}
                  <path d="M90 75 L82 52 L98 68 Z" fill="#28392F" />
                  <path d="M120 75 L128 52 L112 68 Z" fill="#28392F" />
                  {/* Eyes (Feline Almond Shape) */}
                  <ellipse cx="98" cy="84" rx="3.5" ry="2" fill="#F5F1E8" transform="rotate(-8 98 84)" />
                  <ellipse cx="112" cy="84" rx="3.5" ry="2" fill="#F5F1E8" transform="rotate(8 112 84)" />
                  <circle cx="98" cy="84" r="1.2" fill="#354A3D" />
                  <circle cx="112" cy="84" r="1.2" fill="#354A3D" />
                  {/* Cute Nose */}
                  <polygon points="103,91 107,91 105,93" fill="#829B83" />
                </g>
              </svg>
            </div>

            {/* 4. HAMSTER */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                stage === 'hamster'
                  ? 'opacity-100 scale-100 translate-y-0 rotate-0'
                  : 'opacity-0 scale-90 translate-y-3 pointer-events-none'
              }`}
            >
              <svg
                viewBox="0 0 200 200"
                className="w-44 h-44 drop-shadow-md text-[#354A3D] fill-current"
              >
                {/* Round and adorable Hamster Silhouette */}
                <g>
                  {/* Chubby Round Body */}
                  <ellipse cx="100" cy="125" rx="42" ry="36" />
                  {/* Soft Belly Lightness */}
                  <ellipse cx="100" cy="132" rx="26" ry="22" fill="#28392F" />
                  {/* Tiny Front Paws */}
                  <ellipse cx="90" cy="138" rx="5" ry="3" fill="#829B83" />
                  <ellipse cx="110" cy="138" rx="5" ry="3" fill="#829B83" />
                  {/* Round Head */}
                  <circle cx="100" cy="92" r="26" />
                  {/* Round Chubby Cheeks */}
                  <ellipse cx="80" cy="98" rx="10" ry="8" />
                  <ellipse cx="120" cy="98" rx="10" ry="8" />
                  {/* Rounded Ears */}
                  <circle cx="82" cy="72" r="8" fill="#28392F" />
                  <circle cx="82" cy="72" r="4.5" fill="#829B83" />
                  <circle cx="118" cy="72" r="8" fill="#28392F" />
                  <circle cx="118" cy="72" r="4.5" fill="#829B83" />
                  {/* Big Curious Eyes */}
                  <circle cx="90" cy="90" r="4.5" fill="#F5F1E8" />
                  <circle cx="90" cy="89" r="2.5" fill="#1E2822" />
                  <circle cx="110" cy="90" r="4.5" fill="#F5F1E8" />
                  <circle cx="110" cy="89" r="2.5" fill="#1E2822" />
                  {/* Little Nose & Mouth */}
                  <polygon points="98,97 102,97 100,99" fill="#829B83" />
                </g>
              </svg>
            </div>

            {/* 5. EAGLE */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                stage === 'eagle'
                  ? 'opacity-100 scale-100 translate-y-0 rotate-0'
                  : 'opacity-0 scale-110 -translate-y-4 pointer-events-none'
              }`}
            >
              <svg
                viewBox="0 0 200 200"
                className="w-48 h-48 drop-shadow-lg text-[#354A3D] fill-current"
              >
                {/* Majestic Eagle with Wings Spread */}
                <g>
                  {/* Majestic Outstretched Wings */}
                  <path
                    d="M100 100 C80 75, 45 60, 20 65 C12 67, 16 78, 28 85 C42 92, 65 102, 85 110 Z"
                    fill="#28392F"
                  />
                  <path
                    d="M100 100 C120 75, 155 60, 180 65 C188 67, 184 78, 172 85 C158 92, 135 102, 115 110 Z"
                    fill="#28392F"
                  />
                  {/* Primary Feathers Tips */}
                  <path d="M20 65 L10 68 L25 76 L15 82 L32 87 Z" fill="#829B83" />
                  <path d="M180 65 L190 68 L175 76 L185 82 L168 87 Z" fill="#829B83" />
                  {/* Muscular Torso & Tail */}
                  <path d="M92 95 C92 95, 88 140, 100 155 C112 140, 108 95, 108 95 Z" />
                  {/* Tail Fan */}
                  <path d="M92 148 L80 172 L100 165 L120 172 L108 148 Z" fill="#829B83" />
                  {/* Proud Head */}
                  <path d="M95 95 C95 85, 92 72, 100 65 C108 72, 105 85, 105 95 Z" fill="#F5F1E8" />
                  {/* Golden Curved Hooked Beak */}
                  <path d="M100 66 C105 66, 115 68, 118 73 C116 75, 108 76, 102 75 Z" fill="#D69738" />
                  {/* Piercing Eye */}
                  <circle cx="102" cy="70" r="2" fill="#1E2822" />
                </g>
              </svg>
            </div>

            {/* 6. DISSOLVE PARTICLES BURST */}
            {stage === 'dissolve' && (
              <div className="absolute inset-0 flex items-center justify-center animate-ping duration-1000">
                <div className="w-24 h-24 rounded-full bg-[#829B83]/30 blur-md" />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Animal Stage Name Tracker */}
        <div className="mt-6 text-center h-8 flex items-center justify-center">
          {stage === 'dog' && (
            <span className="text-xs font-semibold uppercase tracking-widest text-[#354A3D] animate-fade-in">
              Cães • Companheirismo & Fidelidade
            </span>
          )}
          {stage === 'bird' && (
            <span className="text-xs font-semibold uppercase tracking-widest text-[#354A3D] animate-fade-in">
              Aves • Liberdade & Sensibilidade
            </span>
          )}
          {stage === 'cat' && (
            <span className="text-xs font-semibold uppercase tracking-widest text-[#354A3D] animate-fade-in">
              Gatos • Elegância & Singularidade
            </span>
          )}
          {stage === 'hamster' && (
            <span className="text-xs font-semibold uppercase tracking-widest text-[#354A3D] animate-fade-in">
              Pequenos Animais • Delicadeza & Afeto
            </span>
          )}
          {stage === 'eagle' && (
            <span className="text-xs font-semibold uppercase tracking-widest text-[#354A3D] animate-fade-in">
              Silvestres • Majestade & Respeito à Natureza
            </span>
          )}
        </div>
      </div>

      {/* 7. Official Zeludi Logo & Tagline Revelation */}
      <div
        className={`relative z-10 w-full max-w-md text-center transition-all duration-1000 pb-8 ${
          stage === 'logo' || stage === 'dissolve'
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
        }`}
      >
        {/* Zeludi Typography with Paw as the dot of "i" */}
        <div className="inline-flex items-center justify-center gap-1">
          <svg
            viewBox="0 0 280 65"
            className="w-56 sm:w-64 h-auto text-[#354A3D] overflow-visible"
            fill="currentColor"
          >
            {/* z */}
            <path d="M20 22 H42 L24 46 H44 V52 H18 L36 28 H20 Z" />

            {/* e */}
            <path d="M58 37 C58 28, 65 22, 75 22 C85 22, 91 28, 91 38 V40 H65 C66 46, 70 49, 76 49 C81 49, 85 47, 88 44 L92 48 C88 52, 82 54, 75 54 C64 54, 58 47, 58 37 Z M65 35 H84 C83 30, 80 27, 75 27 C70 27, 66 30, 65 35 Z" />

            {/* l */}
            <path d="M102 12 H109 V52 H102 Z" />

            {/* u */}
            <path d="M120 24 H127 V41 C127 46, 131 49, 137 49 C143 49, 147 46, 147 41 V24 H154 V52 H147 V47 C144 51, 140 54, 134 54 C125 54, 120 48, 120 40 Z" />

            {/* d */}
            <path d="M164 38 C164 28, 171 22, 180 22 C186 22, 191 25, 194 30 V12 H201 V52 H194 V46 C191 51, 186 54, 180 54 C171 54, 164 47, 164 38 Z M171 38 C171 45, 175 49, 181 49 C187 49, 194 45, 194 38 C194 31, 187 27, 181 27 C175 27, 171 31, 171 38 Z" />

            {/* i (Stem) */}
            <path d="M213 24 H220 V52 H213 Z" />

            {/* i (Dot replaced by exquisite miniature paw print) */}
            <g transform="translate(216.5, 12)">
              {/* Main Pad */}
              <ellipse cx="0" cy="3" rx="3.5" ry="2.6" fill="#829B83" />
              {/* 4 Toe beans */}
              <circle cx="-3.4" cy="-1.5" r="1.3" fill="#829B83" />
              <circle cx="-1.2" cy="-3.5" r="1.4" fill="#829B83" />
              <circle cx="1.2" cy="-3.5" r="1.4" fill="#829B83" />
              <circle cx="3.4" cy="-1.5" r="1.3" fill="#829B83" />
            </g>
          </svg>
        </div>

        {/* Philosophical Tagline */}
        <p className="text-xs sm:text-sm font-medium text-[#596B60] mt-2 tracking-wide animate-fade-in">
          Cada pet é único. Cada cuidado importa.
        </p>

        {/* Small subtle brand pill */}
        <div className="inline-block mt-3 px-3 py-1 rounded-full bg-[#354A3D]/10 text-[10px] font-semibold tracking-widest uppercase text-[#354A3D]">
          Saúde Preventiva Multi-espécies
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="relative z-10 w-full max-w-xs pb-4">
        <div className="w-full bg-[#DCCBB5]/40 rounded-full h-1 overflow-hidden">
          <div
            className="bg-[#354A3D] h-full transition-all duration-100 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
