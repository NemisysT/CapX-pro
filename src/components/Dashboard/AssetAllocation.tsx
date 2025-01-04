'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import EmptyStateHandler from "@/components/shared/EmptyStateHandler"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

interface AllocationData {
  name: string
  value: number
}

export default function AssetAllocation() {
  const [allocationData, setAllocationData] = useState<AllocationData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY

  useEffect(() => {
    const calculateAllocation = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: holdings } = await supabase
          .from('stock_holdings')
          .select('*')
          .eq('user_id', user.id)

        if (!holdings || holdings.length === 0) return

        // Calculate current value of each holding
        const holdingValues = await Promise.all(
          holdings.map(async (holding) => {
            const response = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${holding.symbol}&token=${FINNHUB_API_KEY}`
            )
            const data = await response.json()
            return {
              symbol: holding.symbol,
              value: holding.quantity * (data.c || holding.purchase_price)
            }
          })
        )

        const totalValue = holdingValues.reduce((sum, { value }) => sum + value, 0)

        // Group by stock symbol
        const stockAllocation = holdingValues.map(({ symbol, value }) => ({
          name: symbol,
          value: (value / totalValue) * 100
        }))

        setAllocationData(stockAllocation)
        setLoading(false)
      } catch (error) {
        console.error('Error calculating asset allocation:', error)
      }
    }

    calculateAllocation()
    const interval = setInterval(calculateAllocation, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [FINNHUB_API_KEY, supabase])

  if (loading) return <div>Loading...</div>

  if (!loading && allocationData.length === 0) {
    return (
      <div className="w-full md:w-1/2 xl:w-1/3 px-6 py-3">
        <Card>
          <CardContent>
            <EmptyStateHandler />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full md:w-1/2 xl:w-1/3 px-6 py-3">
      <Card className="h-[400px] shadow-md border rounded-lg">
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="80%"
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
              >
                {allocationData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
