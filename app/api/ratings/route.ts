import { NextRequest, NextResponse } from 'next/server'
import { getFliiinkerServiceRating, getCustomerRating, getRatingStats } from '@/lib/rating'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fliiinkerId = searchParams.get('fliiinkerId')
    const type = searchParams.get('type') // 'service' | 'customer' | 'stats'

    if (!fliiinkerId) {
      return NextResponse.json({ error: 'fliiinkerId manquant' }, { status: 400 })
    }

    switch (type) {
      case 'service':
        const serviceRatings = await getFliiinkerServiceRating(fliiinkerId)
        return NextResponse.json({ data: serviceRatings })

      case 'customer':
        const customerRatings = await getCustomerRating(fliiinkerId)
        return NextResponse.json({ data: customerRatings })

      case 'stats':
        const stats = await getRatingStats(fliiinkerId)
        return NextResponse.json({ data: stats })

      default:
        // Récupérer toutes les données en une fois
        const [serviceData, customerData, statsData] = await Promise.all([
          getFliiinkerServiceRating(fliiinkerId),
          getCustomerRating(fliiinkerId),
          getRatingStats(fliiinkerId)
        ])

        return NextResponse.json({
          serviceRatings: serviceData,
          customerRatings: customerData,
          stats: statsData
        })
    }
  } catch (error) {
    console.error('Erreur API ratings:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des ratings' },
      { status: 500 }
    )
  }
}
