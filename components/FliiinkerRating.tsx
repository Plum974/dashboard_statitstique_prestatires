'use client'

import { useState, useEffect } from 'react'
import { Star, User, MessageSquare, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FliiinkerServiceRating, CustomerRating, RatingStats } from '@/types/database'

const base_url_image = process.env.NEXT_PUBLIC_BASE_URL_IMAGE

// Fonction pour construire l'URL de l'avatar
const getAvatarUrl = (avatar?: string, firstName?: string, lastName?: string) => {
  if (base_url_image && avatar) {
    return `${base_url_image}/${avatar}`
  }
  return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=3b82f6&color=fff`
}

interface FliiinkerRatingProps {
  fliiinkerId: string
  showAsFliiinker?: boolean // true = affiche les avis reçus, false = affiche les avis donnés
}

export default function FliiinkerRating({ fliiinkerId, showAsFliiinker = true }: FliiinkerRatingProps) {
  const [serviceRatings, setServiceRatings] = useState<FliiinkerServiceRating[]>([])
  const [customerRatings, setCustomerRatings] = useState<CustomerRating[]>([])
  const [stats, setStats] = useState<RatingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received')

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true)
      try {
        if (showAsFliiinker) {
          // Récupérer toutes les données en une fois
          const response = await fetch(`/api/ratings?fliiinkerId=${fliiinkerId}`)
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des ratings')
          }
          
          const data = await response.json()
          setServiceRatings(data.serviceRatings || [])
          setCustomerRatings(data.customerRatings || [])
          setStats(data.stats)
        } else {
          // Récupérer seulement les avis donnés par le client
          const response = await fetch(`/api/ratings?fliiinkerId=${fliiinkerId}&type=customer`)
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des ratings')
          }
          
          const data = await response.json()
          setCustomerRatings(data.data || [])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des ratings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRatings()
  }, [fliiinkerId, showAsFliiinker])

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    }
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const renderRatingBreakdown = () => {
    if (!stats || stats.totalRatings === 0) return null

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = stats.ratingsBreakdown[star as keyof typeof stats.ratingsBreakdown]
          const percentage = (count / stats.totalRatings) * 100

          return (
            <div key={star} className="flex items-center text-sm">
              <span className="w-3 text-gray-600">{star}</span>
              <Star className="w-3 h-3 text-yellow-400 fill-current mx-1" />
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-right text-gray-600">{count}</span>
            </div>
          )
        })}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Chargement des avis...</span>
        </div>
      </div>
    )
  }

  const ratingsToShow = showAsFliiinker 
    ? (activeTab === 'received' ? serviceRatings : customerRatings)
    : customerRatings

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques (seulement pour les avis reçus) */}
      {showAsFliiinker && stats && stats.totalRatings > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center text-gray-900">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              Note moyenne
            </h3>
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stats.totalRatings} avis
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              {renderRatingBreakdown()}
            </div>
            <div className="text-center bg-white/60 rounded-xl p-4 border border-yellow-200/30">
              {renderStars(Math.round(stats.averageRating), 'lg')}
              <p className="text-sm text-gray-600 mt-2 font-medium">
                {stats.averageRating.toFixed(1)} / 5 étoiles
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation par onglets (seulement si on affiche un fliiinker complet) */}
      {showAsFliiinker && (
        <div className="bg-white rounded-xl border border-gray-200/50 p-1 flex space-x-1">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'received'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Avis reçus</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === 'received' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {serviceRatings.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('given')}
            className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'given'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Avis donnés</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === 'given' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {customerRatings.length}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Liste des avis */}
      <div className="bg-white rounded-2xl border border-gray-200/50 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center text-gray-900">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            {showAsFliiinker 
              ? (activeTab === 'received' ? 'Avis reçus' : 'Avis donnés')
              : 'Avis donnés'
            }
          </h3>
          <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
            {ratingsToShow.length} avis
          </span>
        </div>

        {ratingsToShow.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun avis pour le moment</h4>
            <p className="text-gray-500">
              {showAsFliiinker 
                ? (activeTab === 'received' ? 'Les avis des clients apparaîtront ici.' : 'Les avis donnés apparaîtront ici.')
                : 'Les avis donnés apparaîtront ici.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ratingsToShow.map((rating, index) => {
              const profile = showAsFliiinker 
                ? (activeTab === 'received' 
                    ? (rating as FliiinkerServiceRating).customer_profile 
                    : (rating as CustomerRating).fliiinker_profile)
                : (rating as CustomerRating).fliiinker_profile

              return (
                <div key={rating.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-200/50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {profile ? (
                        <img
                          src={getAvatarUrl(profile.avatar, profile.first_name, profile.last_name)}
                          alt={`${profile.first_name} ${profile.last_name}`}
                          className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center shadow-md">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {profile 
                              ? `${profile.first_name} ${profile.last_name}`
                              : 'Utilisateur anonyme'
                            }
                          </h4>
                          <p className="text-sm text-gray-500 font-medium">
                            {format(new Date(rating.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {renderStars(rating.rating, 'md')}
                          <span className="text-sm font-bold text-gray-700">
                            {rating.rating}/5
                          </span>
                        </div>
                      </div>
                      
                      {rating.comment && (
                        <div className="bg-white/80 rounded-lg p-4 border border-gray-100">
                          <p className="text-gray-700 leading-relaxed italic">
                            "{rating.comment}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
