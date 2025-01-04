'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import EmptyStateHandler from "@/components/shared/EmptyStateHandler"

interface StockPerformance {
  symbol: string
  percentageChange: number
}

export default function DashboardSummary() {
  const [totalValue, setTotalValue] = useState(0)
  const [monthlyChange, setMonthlyChange] = useState(0)
  const [topStock, setTopStock] = useState<StockPerformance | null>(null)
  const [recentTransaction, setRecentTransaction] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClientComponentClient()
  const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch holdings
        const { data: holdings } = await supabase
          .from('stock_holdings')
          .select('*')
          .eq('user_id', user.id)

        if (!holdings || holdings.length === 0) {
          setLoading(false)
          return
        }

        // Calculate total value and find performance
        let currentTotal = 0
        const stockPerformances: StockPerformance[] = []

        for (const holding of holdings) {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${holding.symbol}&token=${FINNHUB_API_KEY}`
          )
          const data = await response.json()
          const currentPrice = data.c || holding.purchase_price
          const value = holding.quantity * currentPrice
          currentTotal += value

          const percentageChange = ((currentPrice - holding.purchase_price) / holding.purchase_price) * 100
          stockPerformances.push({
            symbol: holding.symbol,
            percentageChange
          })
        }

        // Set total value
        setTotalValue(currentTotal)

        // Set monthly change (using a simplified calculation)
        setMonthlyChange(((currentTotal - (currentTotal * 0.95)) / (currentTotal * 0.95)) * 100)

        // Find top performing stock
        const topPerformer = stockPerformances.reduce((prev, current) => 
          prev.percentageChange > current.percentageChange ? prev : current
        )
        setTopStock(topPerformer)

        // Get most recent transaction
        const { data: recentTx } = await supabase
          .from('stock_holdings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        setRecentTransaction(recentTx)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  if (loading) return <div>Loading...</div>
  
  if (!loading && (!totalValue || totalValue === 0)) {
    return (
      <Card>
        <CardContent>
          <EmptyStateHandler />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Total Portfolio Value:</strong> ${totalValue.toFixed(2)}</p>
          <p>
            <strong>Monthly Change:</strong> 
            <span className={monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}>
              {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(2)}%
            </span>
          </p>
          {topStock && (
            <p>
              <strong>Top Performing Stock:</strong> {topStock.symbol} (
              <span className={topStock.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                {topStock.percentageChange >= 0 ? '+' : ''}{topStock.percentageChange.toFixed(2)}%
              </span>
              )
            </p>
          )}
          {recentTransaction && (
            <p>
              <strong>Recent Transaction:</strong> Bought {recentTransaction.quantity} {recentTransaction.symbol} @ ${recentTransaction.purchase_price.toFixed(2)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

