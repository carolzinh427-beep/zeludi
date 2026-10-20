'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

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

  // Timing: Exactly 5 seconds total (5000ms)
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []

    // 0ms - 800ms: Dog profile
    // 800ms - 1600ms: Bird profile
    timeouts.push(setTimeout(() => setStage('bird'), 800))
    // 1600ms - 2400ms: Cat profile
    timeouts.push(setTimeout(() => setStage('cat'), 1600))
    // 2400ms - 3200ms: Hamster profile
    timeouts.push(setTimeout(() => setStage('hamster'), 2400))
    // 3200ms - 4000ms: Eagle profile
    timeouts.push(setTimeout(() => setStage('eagle'), 3200))
    // 4000ms - 4200ms: Dissolve burst
    timeouts.push(setTimeout(() => setStage('dissolve'), 4000))
    // 4200ms - 5000ms: Zeludi logo reveal
    timeouts.push(setTimeout(() => setStage('logo'), 4150))

    // Exactly 5000ms: smooth fade-out and direct completion
    timeouts.push(
      setTimeout(() => {
        setIsFadingOut(true)
        setTimeout(() => {
          setStage('finished')
          if (typeof window !== 'undefined') {
            localStorage.setItem('zeludi_seen_splash', 'true')
          }
          if (onComplete) onComplete()
        }, 400)
      }, 5000)
    )

    // Progress bar animation for 5000ms
    const startTime = Date.now()
    const totalDuration = 5000
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100))
      setProgress(pct)
      if (pct >= 100) clearInterval(progressInterval)
    }, 30)

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

    // Floating particles
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6 - 0.2,
      alpha: Math.random() * 0.35 + 0.1,
      color: Math.random() > 0.5 ? '#829B83' : '#DCCBB5',
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Soft center glowing radial gradient
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        30,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.55
      )
      gradient.addColorStop(0, 'rgba(238, 243, 239, 0.85)')
      gradient.addColorStop(0.65, 'rgba(245, 241, 232, 0.95)')
      gradient.addColorStop(1, '#F5F1E8')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Floating particles
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
    }, 300)
  }

  if (stage === 'finished') return null

  const isAnimalStage =
    stage === 'dog' ||
    stage === 'bird' ||
    stage === 'cat' ||
    stage === 'hamster' ||
    stage === 'eagle'

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 select-none transition-opacity duration-400 bg-[#F5F1E8] ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Top Header: Simple Skip Button */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-end pt-2">
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
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full flex items-center justify-center">
          {/* Pulsing ring aura */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#829B83]/20 via-[#DCCBB5]/25 to-[#354A3D]/10 blur-xl animate-pulse" />
          <div className="absolute inset-3 rounded-full border border-[#829B83]/25 bg-white/50 backdrop-blur-xs shadow-inner" />

          {/* Morphing Animal Profiles with Ultra Smooth Crossfading */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* 1. DOG PROFILE */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                stage === 'dog'
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}
            >
              <svg viewBox="0 0 200 200" className="w-44 h-44 drop-shadow-sm overflow-visible">
                <defs>
                  <linearGradient id="dogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#354A3D" />
                    <stop offset="100%" stopColor="#25352C" />
                  </linearGradient>
                  <linearGradient id="dogEarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#829B83" />
                    <stop offset="100%" stopColor="#354A3D" />
                  </linearGradient>
                </defs>

                {/* Neck & Chest in Profile */}
                <path
                  d="M 68 175 C 72 145 76 120 86 102 C 92 90 98 82 108 78 C 118 74 134 78 148 90 C 158 98 162 104 162 110 C 160 114 152 116 142 115 C 132 114 126 122 120 135 C 114 148 116 162 124 175 Z"
                  fill="url(#dogGrad)"
                />

                {/* Refined Muzzle & Head Contour */}
                <path
                  d="M 96 82 C 102 75 112 72 122 72 C 132 72 144 78 152 86 C 158 92 165 98 166 104 C 166 108 162 112 152 113 C 144 114 138 112 134 116 C 130 120 128 126 122 134 C 116 124 112 112 106 102 Z"
                  fill="#354A3D"
                />

                {/* Sleek Drooping Ear in Profile */}
                <path
                  d="M 104 74 C 110 74 116 80 116 92 C 116 108 110 128 104 134 C 98 140 92 136 90 126 C 88 112 92 92 98 80 C 100 76 102 74 104 74 Z"
                  fill="url(#dogEarGrad)"
                />

                {/* Nose Pad */}
                <path
                  d="M 162 100 C 166 101 167 105 165 108 C 163 110 159 110 157 107 C 156 104 158 101 162 100 Z"
                  fill="#1E2822"
                />

                {/* Serene Eye in Profile */}
                <path
                  d="M 132 86 C 136 85 140 88 140 90 C 139 92 134 93 131 91 C 130 90 131 87 132 86 Z"
                  fill="#F5F1E8"
                />
                <circle cx="134" cy="88.5" r="1.6" fill="#1E2822" />

                {/* Delicate Collar Accent */}
                <path
                  d="M 88 155 Q 102 158 118 154"
                  stroke="#829B83"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>

            {/* 2. BIRD PROFILE */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                stage === 'bird'
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
              }`}
            >
              <svg viewBox="0 0 200 200" className="w-44 h-44 drop-shadow-sm overflow-visible">
                <defs>
                  <linearGradient id="birdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#354A3D" />
                    <stop offset="100%" stopColor="#25352C" />
                  </linearGradient>
                  <linearGradient id="birdWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#829B83" />
                    <stop offset="100%" stopColor="#354A3D" />
                  </linearGradient>
                </defs>

                {/* Body & Breast Profile */}
                <path
                  d="M 80 170 C 75 150 78 130 88 115 C 95 105 105 98 118 96 C 128 94 138 90 144 82 C 146 80 148 76 150 74 C 148 85 140 94 132 100 C 136 108 138 120 135 135 C 130 152 118 165 100 172 Z"
                  fill="url(#birdGrad)"
                />

                {/* Sharp Elegant Beak */}
                <path d="M 148 76 L 172 82 L 146 86 Z" fill="#D49E58" />

                {/* Head & Crest */}
                <path
                  d="M 118 78 C 124 68 134 66 142 72 C 148 76 148 82 142 86 C 134 90 124 88 118 84 Z"
                  fill="#354A3D"
                />
                <path
                  d="M 124 72 C 120 60 110 52 100 48 C 112 55 118 64 122 70 Z"
                  fill="#829B83"
                />

                {/* Eye in Profile */}
                <circle cx="134" cy="78" r="3.2" fill="#F5F1E8" />
                <circle cx="134.5" cy="78" r="1.8" fill="#1E2822" />

                {/* Wing Arc Layer */}
                <path
                  d="M 94 118 C 104 112 118 115 124 126 C 128 138 122 154 105 168 C 100 155 98 140 94 118 Z"
                  fill="url(#birdWingGrad)"
                />

                {/* Long Tail Feathers */}
                <path
                  d="M 82 165 L 65 192 L 74 168 L 58 190 L 78 160 Z"
                  fill="#829B83"
                />
              </svg>
            </div>

            {/* 3. CAT PROFILE */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                stage === 'cat'
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
              }`}
            >
              <svg viewBox="0 0 200 200" className="w-44 h-44 drop-shadow-sm overflow-visible">
                <defs>
                  <linearGradient id="catGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#354A3D" />
                    <stop offset="100%" stopColor="#25352C" />
                  </linearGradient>
                  <linearGradient id="catEarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#829B83" />
                    <stop offset="100%" stopColor="#354A3D" />
                  </linearGradient>
                </defs>

                {/* Neck, Back & Chest Silhouette */}
                <path
                  d="M 65 175 C 70 148 76 128 88 112 C 96 102 102 96 110 92 C 116 88 124 88 135 94 C 144 100 150 106 150 110 C 148 114 142 115 135 116 C 128 117 122 124 118 136 C 114 150 116 164 122 175 Z"
                  fill="url(#catGrad)"
                />

                {/* Head with Feline Snout Stop */}
                <path
                  d="M 96 82 C 102 78 112 78 122 80 C 130 82 140 88 146 95 C 150 100 152 105 148 108 C 142 110 136 109 130 112 C 126 115 124 122 118 128 C 110 118 105 106 98 94 Z"
                  fill="#354A3D"
                />

                {/* Alert Triangular Pointed Ear */}
                <path d="M 94 82 L 98 48 L 118 78 Z" fill="url(#catEarGrad)" />
                <path d="M 98 78 L 102 56 L 114 76 Z" fill="#F5F1E8" opacity="0.25" />

                {/* Cute Feline Nose */}
                <path
                  d="M 148 101 C 151 102 151 105 149 107 C 147 108 144 107 144 105 C 144 103 146 101 148 101 Z"
                  fill="#829B83"
                />

                {/* Feline Almond Slit Eye in Profile */}
                <path
                  d="M 126 88 C 132 87 138 90 137 92 C 134 94 128 94 125 91 C 124 90 125 88 126 88 Z"
                  fill="#F5F1E8"
                />
                <ellipse cx="131" cy="90.5" rx="1.2" ry="2.2" fill="#1E2822" />

                {/* Minimalist Whisker Accents */}
                <path
                  d="M 142 108 Q 158 107 168 110 M 140 112 Q 156 114 165 119"
                  stroke="#829B83"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.75"
                  fill="none"
                />
              </svg>
            </div>

            {/* 4. HAMSTER PROFILE */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                stage === 'hamster'
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
              }`}
            >
              <svg viewBox="0 0 200 200" className="w-44 h-44 drop-shadow-sm overflow-visible">
                <defs>
                  <linearGradient id="hamsterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#354A3D" />
                    <stop offset="100%" stopColor="#25352C" />
                  </linearGradient>
                </defs>

                {/* Plump Curved Hunched Body */}
                <path
                  d="M 68 165 C 60 148 62 125 72 108 C 82 92 95 84 108 82 C 116 80 125 82 134 88 C 142 94 148 102 148 108 C 148 114 140 120 132 122 C 126 124 122 130 120 138 C 116 150 110 162 98 168 C 86 172 74 172 68 165 Z"
                  fill="url(#hamsterGrad)"
                />

                {/* Soft Light Belly Patch */}
                <path
                  d="M 95 125 C 105 122 115 126 118 136 C 120 148 115 158 102 164 C 95 155 92 142 95 125 Z"
                  fill="#829B83"
                  opacity="0.4"
                />

                {/* Cute Round Ear */}
                <circle cx="102" cy="74" r="10" fill="#354A3D" />
                <circle cx="102" cy="74" r="6" fill="#829B83" opacity="0.6" />

                {/* Tiny Front Paw Under Chin */}
                <ellipse
                  cx="128"
                  cy="132"
                  rx="4.5"
                  ry="3"
                  fill="#829B83"
                  transform="rotate(-15 128 132)"
                />

                {/* Snout with Tiny Button Nose */}
                <circle cx="147" cy="104" r="2.5" fill="#829B83" />

                {/* Big Curious Eye with Highlight */}
                <circle cx="126" cy="94" r="5" fill="#F5F1E8" />
                <circle cx="127" cy="94" r="3.5" fill="#1E2822" />
                <circle cx="125.5" cy="92.5" r="1.2" fill="#FFFFFF" />

                {/* Delicate Whiskers */}
                <path
                  d="M 142 106 Q 158 104 168 105 M 140 109 Q 156 110 166 114"
                  stroke="#829B83"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.8"
                  fill="none"
                />
              </svg>
            </div>

            {/* 5. EAGLE PROFILE */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                stage === 'eagle'
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
              }`}
            >
              <svg viewBox="0 0 200 200" className="w-44 h-44 drop-shadow-sm overflow-visible">
                <defs>
                  <linearGradient id="eagleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#354A3D" />
                    <stop offset="100%" stopColor="#25352C" />
                  </linearGradient>
                  <linearGradient id="beakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E2A64C" />
                    <stop offset="100%" stopColor="#BA7D28" />
                  </linearGradient>
                </defs>

                {/* Majestic Neck & Plumage in Profile */}
                <path
                  d="M 65 175 C 68 145 74 122 84 105 C 92 92 102 85 114 82 C 124 80 134 84 142 92 C 145 95 146 100 144 104 C 138 108 128 112 122 120 C 114 132 115 152 122 175 Z"
                  fill="url(#eagleGrad)"
                />

                {/* Layered Crown Feathers at Nape */}
                <path d="M 84 105 L 68 114 L 86 98 L 72 102 L 94 90 Z" fill="#829B83" />

                {/* Powerful Curved Hooked Beak */}
                <path
                  d="M 132 86 C 142 86 154 90 160 98 C 166 106 166 118 158 126 C 156 128 153 124 154 118 C 154 110 148 104 138 102 Z"
                  fill="url(#beakGrad)"
                />

                {/* Head & Brow Ridge Overhang */}
                <path
                  d="M 104 82 C 112 76 122 76 132 82 C 138 85 142 90 138 96 C 130 98 122 96 114 94 Z"
                  fill="#354A3D"
                />

                {/* Intense Piercing Eye */}
                <circle cx="120" cy="88" r="4.2" fill="#F5F1E8" />
                <circle cx="120" cy="88" r="2.5" fill="#E2A64C" />
                <circle cx="120.5" cy="88" r="1.4" fill="#1E2822" />

                {/* Determined Brow Shadow */}
                <path
                  d="M 112 84 Q 124 82 128 86"
                  stroke="#243329"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>

            {/* 6. DISSOLVE PARTICLE FLASH */}
            {stage === 'dissolve' && (
              <div className="absolute inset-0 flex items-center justify-center animate-ping duration-700">
                <div className="w-20 h-20 rounded-full bg-[#829B83]/30 blur-md" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Official Zeludi Logo & Tagline Revelation */}
      <div
        className={`relative z-10 w-full max-w-md text-center transition-all duration-600 pb-8 ${
          stage === 'logo' || stage === 'dissolve'
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
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
        <p className="text-xs sm:text-sm font-medium text-[#596B60] mt-2 tracking-wide">
          Cada pet é único. Cada cuidado importa.
        </p>
      </div>

      {/* Bottom Progress Bar: 5-second indication */}
      <div className="relative z-10 w-full max-w-xs pb-4">
        <div className="w-full bg-[#DCCBB5]/40 rounded-full h-1 overflow-hidden">
          <div
            className="bg-[#354A3D] h-full transition-all duration-75 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
