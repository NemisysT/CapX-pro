'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import EmptyStateHandler from "@/components/shared/EmptyStateHandler"

interface StockHolding {
  id: string
  symbol: string
  quantity: number
  purchase_price: number
  currentPrice?: number
}

// interface Trade {
//   s: string  // symbol
//   p: number  // price
// }

export default function PortfolioValueTracker() {
  const [holdings, setHoldings] = useState<StockHolding[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // const socketRef = useRef<WebSocket | null>(null)
  
  const supabase = createClientComponentClient()
  const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY

  const fetchStockPrice = async (symbol: string) => {
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      )
      const data = await response.json()
      return data.c ?? null
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error)
      return null
    }
  }

  const initializeHoldingsWithPrices = useCallback(async (stockHoldings: StockHolding[]) => {
    const updatedHoldings = await Promise.all(
      stockHoldings.map(async (holding) => {
        const currentPrice = await fetchStockPrice(holding.symbol)
        return { ...holding, currentPrice: currentPrice || holding.purchase_price }
      })
    )
    setHoldings(updatedHoldings)
  }, [])

  const fetchHoldings = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('stock_holdings')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching holdings:', error)
      return []
    }
  }, [supabase])

  useEffect(() => {
    const initialize = async () => {
      try {
        const stockHoldings = await fetchHoldings()
        if (stockHoldings.length > 0) {
          await initializeHoldingsWithPrices(stockHoldings)
        } else {
          setHoldings([])
        }
      } catch (err) {
        console.error('Initialization error:', err)
        setError('Failed to initialize portfolio data')
      } finally {
        setLoading(false)
      }
    }
    initialize()
  }, [fetchHoldings, initializeHoldingsWithPrices])

  useEffect(() => {
    setTotalValue(
      holdings.reduce((total, holding) =>
        total + holding.quantity * (holding.currentPrice || holding.purchase_price), 0
      )
    )
  }, [holdings])

  if (loading) return <div className="text-red-500">Loading portfolio data...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>
  if (!loading && holdings.length === 0) return <EmptyStateHandler />

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg rounded-lg p-4">
      <Card className="bg-gray-700 border-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold text-silver-500">Total Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-silver-300">${totalValue.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-silver-500">Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="text-silver-400">
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Gain/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => {
                const currentPrice = holding.currentPrice || holding.purchase_price
                const value = holding.quantity * currentPrice
                const gainLoss = value - (holding.quantity * holding.purchase_price)
                const gainLossPercentage = ((gainLoss / (holding.quantity * holding.purchase_price)) * 100)

                return (
                  <TableRow key={holding.id} className="hover:bg-gray-600">
                    <TableCell className="font-medium">{holding.symbol}</TableCell>
                    <TableCell>{holding.quantity}</TableCell>
                    <TableCell>${holding.purchase_price.toFixed(2)}</TableCell>
                    <TableCell>${currentPrice.toFixed(2)}</TableCell>
                    <TableCell>${value.toFixed(2)}</TableCell>
                    <TableCell className={gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                      ${gainLoss.toFixed(2)} ({gainLossPercentage.toFixed(2)}%)
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
