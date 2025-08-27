'use client'

import { FliiinkerData } from '@/types/database'
import { X } from 'lucide-react'
import dynamic from 'next/dynamic'

// Import dynamique pour le composant de rating
const FliiinkerRating = dynamic(() => import('./FliiinkerRating'), {
  ssr: false,
  loading: () => (
    <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Chargement des avis...</p>
    </div>
  )
})

const base_url_image = process.env.NEXT_PUBLIC_BASE_URL_IMAGE

// Fonction pour construire l'URL de l'avatar
const getAvatarUrl = (avatar?: string, firstName?: string, lastName?: string) => {
  if (base_url_image && avatar) {
    return `${base_url_image}/${avatar}`
  }
  return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=3b82f6&color=fff`
}

interface FliiinkerRatingModalProps {
  fliiinker: FliiinkerData | null
  isOpen: boolean
  onClose: () => void
}

export default function FliiinkerRatingModal({ fliiinker, isOpen, onClose }: FliiinkerRatingModalProps) {
  if (!isOpen || !fliiinker) return null

  const { profile } = fliiinker

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <img
                src={getAvatarUrl(profile.avatar, profile.first_name, profile.last_name)}
                alt={`${profile.first_name} ${profile.last_name}`}
                className="w-12 h-12 rounded-full border-2 border-gray-200"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Avis et évaluations
                </h2>
                <p className="text-gray-600">
                  {profile.first_name} {profile.last_name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto">
            <FliiinkerRating 
              fliiinkerId={profile.id} 
              showAsFliiinker={true} 
            />
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
