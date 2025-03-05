'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface PortfolioStats {
  currentValue: number
  dailyChange: number
  dailyChangePercent: number
  highValue: number
  lowValue: number
}

export default function PortfolioValueSummary() {
  const [stats, setStats] = useState<PortfolioStats>({
    currentValue: 0,
    dailyChange: 0,
    dailyChangePercent: 0,
    highValue: 0,
    lowValue: Number.MAX_VALUE
  })
  const [loading, setLoading] = useState(true)
  
  const supabase = createClientComponentClient()
  const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY

  useEffect(() => {
    const fetchPortfolioStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: holdings } = await supabase
          .from('stock_holdings')
          .select('*')
          .eq('user_id', user.id)

        if (!holdings || holdings.length === 0) {
          setLoading(false)
          return
        }

        let currentTotal = 0
        let previousTotal = 0

        for (const holding of holdings) {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${holding.symbol}&token=${FINNHUB_API_KEY}`
          )
          const data = await response.json()
          const currentPrice = data.c || holding.purchase_price
          const previousPrice = data.pc || holding.purchase_price // pc is previous close price
          
          currentTotal += holding.quantity * currentPrice
          previousTotal += holding.quantity * previousPrice
        }

        const dailyChange = currentTotal - previousTotal
        const dailyChangePercent = (dailyChange / previousTotal) * 100

        setStats(prev => ({
          currentValue: currentTotal,
          dailyChange,
          dailyChangePercent,
          highValue: Math.max(prev.highValue, currentTotal),
          lowValue: Math.min(prev.lowValue, currentTotal)
        }))

        setLoading(false)
      } catch (error) {
        console.error('Error fetching portfolio stats:', error)
        setLoading(false)
      }
    }

    fetchPortfolioStats()
    const interval = setInterval(fetchPortfolioStats, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [FINNHUB_API_KEY, supabase])

  if (loading) return <div className="text-white">Loading...</div>

  return (
    <Card className="bg-gradient-to-r from-gray-800 to-gray-600 shadow-lg rounded-lg p-4">
      <CardHeader className="border-b border-gray-400">
        <CardTitle className="text-xl font-bold text-white">Portfolio Value Summary</CardTitle>
      </CardHeader>
      <CardContent className="text-white">
        <div className="space-y-2">
          <p><strong>Current Total Value:</strong> ${stats.currentValue.toFixed(2)}</p>
          <p>
            <strong>Today&apos;s Change:</strong> 
            <span className={stats.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}>
              ${stats.dailyChange.toFixed(2)} ({stats.dailyChangePercent >= 0 ? '+' : ''}{stats.dailyChangePercent.toFixed(2)}%)
            </span>
          </p>
          <p><strong>All-Time High:</strong> ${stats.highValue.toFixed(2)}</p>
          {stats.lowValue !== Number.MAX_VALUE && (
            <p><strong>All-Time Low:</strong> ${stats.lowValue.toFixed(2)}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}