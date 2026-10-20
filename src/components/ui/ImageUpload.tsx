'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { Camera, UploadCloud, X, CheckCircle2, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  value: string | null
  onChange: (dataUrlOrUrl: string | null) => void
  label?: string
}

export function ImageUpload({
  value,
  onChange,
  label = 'Foto do Pet',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [useUrlFallback, setUseUrlFallback] = useState(false)

  // Compress and resize image client-side to keep lightweight and fast
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG ou WEBP).')
      return
    }

    setLoading(true)
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = document.createElement('img')
      img.src = event.target?.result as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 800
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          // Compress to WebP or JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85)
          onChange(compressedDataUrl)
        }
        setLoading(false)
      }

      img.onerror = () => {
        setLoading(false)
        alert('Não foi possível processar a imagem selecionada.')
      }
    }

    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#354A3D]">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setUseUrlFallback(!useUrlFallback)}
          className="text-[11px] text-[#829B83] hover:text-[#354A3D] underline transition-colors"
        >
          {useUrlFallback ? 'Fazer upload de arquivo' : 'Ou inserir link (URL)'}
        </button>
      </div>

      {useUrlFallback ? (
        <div className="space-y-2">
          <input
            type="url"
            placeholder="https://exemplo.com/foto-do-pet.jpg"
            value={value || ''}
            onChange={(e) => onChange(e.target.value || null)}
            className="w-full px-4 py-2.5 rounded-2xl border border-[#DCCBB5]/70 text-sm text-[#354A3D] focus:outline-none focus:border-[#354A3D]"
          />
          <p className="text-[11px] text-[#596B60]">
            Insira o link direto de uma foto hospedada online.
          </p>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          {value ? (
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#FAF8F5] border border-[#DCCBB5]/50">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#DCCBB5]/40 bg-white">
                <Image
                  src={value}
                  alt="Pré-visualização do Pet"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#354A3D] flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4C885B] shrink-0" />
                  <span>Foto carregada com sucesso</span>
                </p>
                <p className="text-[11px] text-[#596B60] mt-0.5">
                  Pronta para ser salva na ficha do animal.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#DCCBB5] text-xs font-medium text-[#354A3D] hover:bg-[#EEF3EF] transition-colors"
                >
                  Trocar
                </button>
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="p-1.5 rounded-xl bg-white border border-[#C75B53]/30 text-[#C75B53] hover:bg-[#C75B53]/10 transition-colors"
                  title="Remover foto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                dragActive
                  ? 'border-[#354A3D] bg-[#EEF3EF]'
                  : 'border-[#DCCBB5] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] hover:border-[#829B83]'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white text-[#829B83] flex items-center justify-center shadow-xs">
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#354A3D]" />
                ) : (
                  <Camera className="w-6 h-6" />
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-[#354A3D]">
                  {loading ? 'Otimizando imagem...' : 'Clique para enviar uma foto do seu pet'}
                </p>
                <p className="text-[11px] text-[#596B60] mt-0.5">
                  Ou arraste e solte o arquivo aqui (PNG, JPG ou WEBP até 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
