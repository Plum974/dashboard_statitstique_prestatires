import './globals.css'
import { Inter } from 'next/font/google'
import { HeroUIProvider } from '@heroui/react'
import { AuthProvider } from '@/lib/authContext'
import AuthLayout from '@/components/AuthLayout'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter'
})

export const metadata = {
  title: 'Dashboard Fliiinker',
  description: 'Interface de gestion des profils Fliiinker',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} font-apple`}>
      <body className="bg-white text-gray-900 font-light antialiased">
        <HeroUIProvider>
          <AuthProvider>
            <AuthLayout>
              {children}
            </AuthLayout>
          </AuthProvider>
        </HeroUIProvider>
      </body>
    </html>
  )
} 