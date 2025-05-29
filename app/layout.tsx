import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Animação de Boneco - Computação Gráfica',
  description: 'Animação 3D com Three.js demonstrando FK, IK, Bones e Hinges',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.svg',
  },
  manifest: '/manifest.json',
  robots: '/robots.txt',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
