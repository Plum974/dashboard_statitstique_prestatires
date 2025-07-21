'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/authContext'
import { Button, Input, Card, CardBody, Spinner } from '@heroui/react'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login(email, password)
      if (!success) {
        setError('Email ou mot de passe incorrect')
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-6 bg-white rounded-3xl shadow-lg flex items-center justify-center border border-gray-200/50"
          >
            <img 
              src="/logo.png"
              alt="Logo Plüm" 
              className="w-12 h-12 object-contain"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Bienvenue
            </h1>
            <p className="text-gray-500 font-light">
              Connectez-vous pour accéder au Dashboard Plüm
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-3xl overflow-hidden">
            <CardBody className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Adresse email
                    </label>
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      startContent={<Mail className="w-4 h-4 text-gray-400" />}
                      variant="flat"
                      size="lg"
                      classNames={{
                        base: "w-full",
                        mainWrapper: "h-full",
                        input: "text-medium font-medium",
                        inputWrapper: "h-14 bg-gray-50/80 border border-gray-200/50 rounded-2xl group-data-[focus=true]:bg-white group-data-[focus=true]:border-gray-300 transition-all duration-300",
                      }}
                      isRequired
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Mot de passe
                    </label>
                    <Input
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      startContent={<Lock className="w-4 h-4 text-gray-400" />}
                      endContent={
                        <button
                          type="button"
                          onClick={toggleVisibility}
                          className="focus:outline-none text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {isVisible ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      }
                      type={isVisible ? "text" : "password"}
                      variant="flat"
                      size="lg"
                      classNames={{
                        base: "w-full",
                        mainWrapper: "h-full",
                        input: "text-medium font-medium",
                        inputWrapper: "h-14 bg-gray-50/80 border border-gray-200/50 rounded-2xl group-data-[focus=true]:bg-white group-data-[focus=true]:border-gray-300 transition-all duration-300",
                      }}
                      isRequired
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-2xl"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  isLoading={isLoading}
                  spinner={<Spinner size="sm" color="current" />}
                  isDisabled={!email || !password}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200/50">
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Connexion sécurisée</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-gray-400 font-light">
            © 2024 Dashboard Plüm. Designed by RAKOTONAIVO Aina Raphaël.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
} 