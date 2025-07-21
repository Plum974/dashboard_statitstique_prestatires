'use client'

import { useAuth } from '@/lib/authContext'
import LoginPage from '@/components/LoginPage'
import { Spinner, Button } from '@heroui/react'
import { LogOut } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <Spinner size="lg" color="default" />
          </div>
          <h2 className="text-2xl font-light text-gray-600 mb-2">
            Vérification de l'authentification
          </h2>
          <p className="text-gray-400 font-light">Un instant s'il vous plaît...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Apple ultra-fine */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-between items-center h-12">
            {/* Logo minimaliste */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-apple-intelligence flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 3L4 14h6l-2 7 9-11h-6l2-7z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Dashboard</span>
            </div>
            
            {/* Actions utilisateur */}
            <div className="flex items-center space-x-4">
              {/* Status discret */}
              <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Active</span>
              </div>
              
              {/* Bouton de déconnexion */}
              <Button
                size="sm"
                variant="flat"
                className="h-8 px-3 bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-gray-700 rounded-xl border border-gray-200/50 transition-all duration-200"
                onClick={logout}
                startContent={<LogOut className="w-3 h-3" />}
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal avec beaucoup d'espace */}
      <main className="pt-12">
        {children}
      </main>

      {/* Footer minimaliste */}
      <footer className="mt-32 pb-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="border-t border-gray-100 pt-8">
            <div className="text-center">
              <p className="text-xs text-gray-400 font-light">
                © 2024 Dashboard Plüm. Designed by RAKOTONAIVO Aina Raphaël.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 