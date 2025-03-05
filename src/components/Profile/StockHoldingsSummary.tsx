'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface HoldingSummary {
  totalHoldings: number
  mostValuableHolding: { symbol: string; percentage: number } | null
  recentlyAdded: { symbol: string; quantity: number } | null
  bestPerformer: { symbol: string; percentage: number } | null
}

export default function StockHoldingsSummary() {
  const [summary, setSummary] = useState<HoldingSummary>({
    totalHoldings: 0,
    mostValuableHolding: null,
    recentlyAdded: null,
    bestPerformer: null
  })
  const [loading, setLoading] = useState(true)

  const supabase = createClientComponentClient()
  const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY

  useEffect(() => {
    const fetchHoldingsSummary = async () => {
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

        // Calculate current values and performance
        const holdingsData = await Promise.all(
          holdings.map(async (holding) => {
            const response = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${holding.symbol}&token=${FINNHUB_API_KEY}`
            )
            const data = await response.json()
            const currentPrice = data.c || holding.purchase_price
            const value = holding.quantity * currentPrice
            const percentageChange = ((currentPrice - holding.purchase_price) / holding.purchase_price) * 100

            return {
              ...holding,
              currentValue: value,
              percentageChange
            }
          })
        )

        const totalValue = holdingsData.reduce((sum, h) => sum + h.currentValue, 0)

        // Find most valuable holding
        const mostValuable = holdingsData.reduce((prev, current) =>
          prev.currentValue > current.currentValue ? prev : current
        )

        // Find best performer
        const bestPerformer = holdingsData.reduce((prev, current) =>
          prev.percentageChange > current.percentageChange ? prev : current
        )

        // Get most recently added
        const recentlyAdded = holdings.reduce((prev, current) =>
          new Date(current.created_at) > new Date(prev.created_at) ? current : prev
        )

        setSummary({
          totalHoldings: holdings.length,
          mostValuableHolding: {
            symbol: mostValuable.symbol,
            percentage: (mostValuable.currentValue / totalValue) * 100
          },
          recentlyAdded: {
            symbol: recentlyAdded.symbol,
            quantity: recentlyAdded.quantity
          },
          bestPerformer: {
            symbol: bestPerformer.symbol,
            percentage: bestPerformer.percentageChange
          }
        })

        setLoading(false)
      } catch (error) {
        console.error('Error fetching holdings summary:', error)
        setLoading(false)
      }
    }

    fetchHoldingsSummary()
    const interval = setInterval(fetchHoldingsSummary, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [FINNHUB_API_KEY, supabase])

  if (loading) return <div className="text-white">Loading...</div>

  return (
    <Card className="bg-gradient-to-r from-gray-800 to-gray-600 shadow-lg rounded-lg p-4">
      <CardHeader className="border-b border-gray-400">
        <CardTitle className="text-xl font-bold text-white">Stock Holdings Summary</CardTitle>
      </CardHeader>
      <CardContent className="text-white">
        <div className="space-y-2">
          <p><strong>Total Holdings:</strong> {summary.totalHoldings} stocks</p>
          {summary.mostValuableHolding && (
            <p>
              <strong>Most Valuable Holding:</strong> {summary.mostValuableHolding.symbol} ({summary.mostValuableHolding.percentage.toFixed(1)}% of portfolio)
            </p>
          )}
          {summary.recentlyAdded && (
                        <p>
                        <strong>Recently Added:</strong> {summary.recentlyAdded.symbol} ({summary.recentlyAdded.quantity} shares)
                      </p>
                    )}
                    {summary.bestPerformer && (
                      <p>
                        <strong>Best Performer:</strong> {summary.bestPerformer.symbol} ({summary.bestPerformer.percentage.toFixed(1)}% change)
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          }