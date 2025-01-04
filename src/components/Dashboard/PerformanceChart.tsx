'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import EmptyStateHandler from "@/components/shared/EmptyStateHandler"

interface ChartData {
  name: string
  value: number
}

export default function PerformanceChart() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY

  useEffect(() => {
    const calculateDailyValues = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: holdings } = await supabase
          .from('stock_holdings')
          .select('*')
          .eq('user_id', user.id)

        if (!holdings || holdings.length === 0) return

        // Get current prices for all holdings
        const currentValues = await Promise.all(
          holdings.map(async (holding) => {
            const response = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${holding.symbol}&token=${FINNHUB_API_KEY}`
            )
            const data = await response.json()
            return holding.quantity * (data.c || holding.purchase_price)
          })
        )

        const totalValue = currentValues.reduce((sum, value) => sum + value, 0)

        // Generate sample historical data (in real app, you'd fetch historical data)
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const date = new Date()
          date.setMonth(date.getMonth() - (5 - i))
          return {
            name: date.toLocaleString('default', { month: 'short' }),
            value: totalValue * (0.9 + Math.random() * 0.2) // Random variation for demo
          }
        })

        setChartData(last6Months)
        setLoading(false)
      } catch (error) {
        console.error('Error calculating performance data:', error)
      }
    }

    calculateDailyValues()
    const interval = setInterval(calculateDailyValues, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  if (loading) return <div>Loading...</div>

  if (!loading && chartData.length === 0) {
    return (
      <div className="w-full xl:w-2/3 px-6 py-3">
        <Card>
          <CardContent>
            <EmptyStateHandler />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full xl:w-2/3 px-6 py-3">
      <Card className="h-[400px] shadow-md border rounded-lg">
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Value']} />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
