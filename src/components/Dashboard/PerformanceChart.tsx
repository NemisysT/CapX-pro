'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import EmptyStateHandler from "@/components/shared/EmptyStateHandler"
import { motion } from 'framer-motion'
import { Skeleton } from "@/components/ui/skeleton"

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

        if (!holdings || holdings.length === 0) {
          setLoading(false)
          return
        }

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

        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const date = new Date()
          date.setMonth(date.getMonth() - (5 - i))
          return {
            name: date.toLocaleString('default', { month: 'short' }),
            value: totalValue * (0.9 + Math.random() * 0.2)
          }
        })

        setChartData(last6Months)
        setLoading(false)
      } catch (error) {
        console.error('Error calculating performance data:', error)
        setLoading(false)
      }
    }

    calculateDailyValues()
    const interval = setInterval(calculateDailyValues, 60000)

    return () => clearInterval(interval)
  }, [FINNHUB_API_KEY, supabase])

  if (loading) {
    return (
      <div className="w-full xl:w-2/3 px-6 py-3">
        <Card className="h-[400px]">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <Skeleton className="w-full h-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

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
    <motion.div 
      className="w-full xl:w-2/3 px-6 py-3"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
              <Tooltip 
                formatter={(value) => [`$${(value as number).toFixed(2)}`, 'Value']}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Trial Push

