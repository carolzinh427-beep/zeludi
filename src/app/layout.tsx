import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#354A3D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'Zeludi — Cuidados Inteligentes e Saúde Preventiva para Pets',
  description:
    'Cada pet é único. Cada cuidado importa. Gestão inteligente de saúde preventiva, rotinas e bem-estar para cães, gatos, aves, roedores e outras espécies.',
  keywords: [
    'pet care',
    'saúde animal',
    'veterinário',
    'gestão pet',
    'cães',
    'gatos',
    'vacinas pet',
    'zeludi',
  ],
  authors: [{ name: 'Zeludi Pet Health Technologies' }],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${jakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans selection:bg-[#829B83]/30 selection:text-[#354A3D]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
