
import { FliiinkerServiceRating, CustomerRating, RatingStats } from '@/types/database'
import { supabase } from './supabase'

export async function getFliiinkerServiceRating(fliiinkerId: string): Promise<FliiinkerServiceRating[] | null> {
    try {
        // console.log('Récupération des ratings pour le fliiinker:', fliiinkerId)
        const { data, error } = await supabase
            .from('fliiinker_service_rating')
            .select(`
                *,
                customer_profile:public_profile!customer_id(*)
            `)
            .eq('fliiinker_id', fliiinkerId)

            .order('created_at', { ascending: false })

        if (error) {
            console.error('Erreur Supabase:', error)
            return null
        }

        // console.log('Ratings récupérés:', data)
        return data as FliiinkerServiceRating[]
    } catch (error) {
        console.error('Erreur lors de la récupération des ratings:', error)
        return null
    }
}

export async function getCustomerRating(fliiinkerId: string): Promise<CustomerRating[] | null> {
    try {
        // console.log('Récupération des ratings pour le client:', fliiinkerId)
        const { data, error } = await supabase
            .from('customer_rating')
            .select(`
                *,
                fliiinker_profile:public_profile!fliiinker_id(*)
            `)
            .eq('fliiinker_id', fliiinkerId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Erreur Supabase:', error)
            return null
        }

        // console.log('Ratings clients récupérés:', data)
        return data as CustomerRating[]
    } catch (error) {
        console.error('Erreur lors de la récupération des ratings:', error)
        return null
    }
}

export async function getRatingStats(fliiinkerId: string): Promise<RatingStats | null> {
    try {
        const { data, error } = await supabase
            .from('fliiinker_service_rating')
            .select('rating')
            .eq('fliiinker_id', fliiinkerId)

        if (error) {
            console.error('Erreur Supabase:', error)
            return null
        }

        if (!data || data.length === 0) {
            return {
                averageRating: 0,
                totalRatings: 0,
                ratingsBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            }
        }

        const totalRatings = data.length
        const ratingsSum = data.reduce((sum, item) => sum + item.rating, 0)
        const averageRating = ratingsSum / totalRatings

        const ratingsBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        data.forEach(item => {
            if (item.rating >= 1 && item.rating <= 5) {
                ratingsBreakdown[item.rating as keyof typeof ratingsBreakdown]++
            }
        })

        return {
            averageRating: Math.round(averageRating * 10) / 10, // Arrondi à 1 décimale
            totalRatings,
            ratingsBreakdown
        }
    } catch (error) {
        console.error('Erreur lors du calcul des statistiques:', error)
        return null
    }
}