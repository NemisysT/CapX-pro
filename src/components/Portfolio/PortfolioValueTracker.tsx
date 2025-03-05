'use client'

import { useState, useEffect, useRef } from 'react'
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

interface Trade {
  s: string  // symbol
  p: number  // price
}

export default function PortfolioValueTracker() {
  const [holdings, setHoldings] = useState<StockHolding[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<WebSocket | null>(null)
  
  const supabase = createClientComponentClient()
  const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY

  // Fetch initial price for a stock
  const fetchStockPrice = async (symbol: string) => {
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      )
      const data = await response.json()
      if (data.error) {
        console.error(`Error fetching ${symbol}:`, data.error)
        return null
      }
      return data.c // Current price
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error)
      return null
    }
  }

  // Initialize holdings with current prices
  const initializeHoldingsWithPrices = async (stockHoldings: StockHolding[]) => {
    const updatedHoldings = await Promise.all(
      stockHoldings.map(async (holding) => {
        const currentPrice = await fetchStockPrice(holding.symbol)
        return {
          ...holding,
          currentPrice: currentPrice || holding.purchase_price
        }
      })
    )
    setHoldings(updatedHoldings)
  }

  // Initialize WebSocket connection
  const initializeWebSocket = (stockHoldings: StockHolding[]) => {
    if (!FINNHUB_API_KEY) {
      setError('API key not configured')
      return
    }

    if (socketRef.current) {
      socketRef.current.close()
    }

    try {
      const ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`)
      socketRef.current = ws

      let connectionAttempts = 0
      const maxAttempts = 3

      ws.addEventListener('open', () => {
        console.log('WebSocket connected')
        connectionAttempts = 0
        
        // Subscribe one by one with delay to avoid rate limiting
        stockHoldings.forEach((holding, index) => {
          setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'subscribe',
                symbol: holding.symbol
              }))
            }
          }, index * 500) // 500ms delay between each subscription
        })
      })

      ws.addEventListener('message', (event) => {
        try {
          const message = JSON.parse(event.data)
          if (message.type === 'trade' && message.data?.length > 0) {
            setHoldings(prevHoldings => {
              return prevHoldings.map(holding => {
                const matchingTrade = message.data.find((trade: Trade) => trade.s === holding.symbol)
                if (matchingTrade) {
                  return {
                    ...holding,
                    currentPrice: matchingTrade.p
                  }
                }
                return holding
              })
            })
          }
        } catch (error) {
          console.error('Error processing message:', error)
        }
      })

      ws.addEventListener('error', (event) => {
        console.error('WebSocket error:', event)
        connectionAttempts++
        
        if (connectionAttempts >= maxAttempts) {
          console.log('Falling back to REST API updates')
          if (ws) ws.close()
          // Start periodic REST API updates
          const interval = setInterval(() => updatePricesViaREST(stockHoldings), 10000)
          return () => clearInterval(interval)
        }
      })

      ws.addEventListener('close', () => {
        console.log('WebSocket disconnected')
        if (connectionAttempts < maxAttempts) {
          setTimeout(() => {
            if (stockHoldings.length > 0) {
              initializeWebSocket(stockHoldings)
            }
          }, 5000)
        }
      })

      return ws
    } catch (error) {
      console.error('Error creating WebSocket:', error)
      // Fall back to REST API updates
      const interval = setInterval(() => updatePricesViaREST(stockHoldings), 10000)
      return () => clearInterval(interval)
    }
  }

  // Add this function for REST API fallback
  const updatePricesViaREST = async (stockHoldings: StockHolding[]) => {
    try {
      const updatedHoldings = await Promise.all(
        stockHoldings.map(async (holding) => {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${holding.symbol}&token=${FINNHUB_API_KEY}`
          )
          const data = await response.json()
          return {
            ...holding,
            currentPrice: data.c || holding.currentPrice || holding.purchase_price
          }
        })
      )
      setHoldings(updatedHoldings)
    } catch (error) {
      console.error('Error updating prices via REST:', error)
    }
  }

  useEffect(() => {
    const initialize = async () => {
      try {
        const stockHoldings = await fetchHoldings()
        if (stockHoldings.length > 0) {
          await initializeHoldingsWithPrices(stockHoldings)
          initializeWebSocket(stockHoldings)
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

    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        holdings.forEach((holding) => {
          socketRef.current?.send(JSON.stringify({
            type: 'unsubscribe',
            symbol: holding.symbol
          }))
        })
        socketRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    const newTotalValue = holdings.reduce((total, holding) =>
      total + holding.quantity * (holding.currentPrice || holding.purchase_price), 0
    )
    setTotalValue(newTotalValue)
  }, [holdings])

  // Fetch user's stock holdings from Supabase
  const fetchHoldings = async () => {
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
  }

  if (loading) {
    return <div className="text-red-500">Loading portfolio data...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!loading && holdings.length === 0) {
    return <EmptyStateHandler />
  }

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
