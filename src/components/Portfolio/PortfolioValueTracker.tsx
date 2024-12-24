'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface StockHolding {
  symbol: string
  quantity: number
  purchasePrice: number
  currentPrice: number
}

export default function PortfolioValueTracker() {
  const [holdings, setHoldings] = useState<StockHolding[]>([
    { symbol: 'AAPL', quantity: 10, purchasePrice: 150, currentPrice: 150 },
    { symbol: 'GOOGL', quantity: 5, purchasePrice: 2500, currentPrice: 2500 },
    { symbol: 'MSFT', quantity: 15, purchasePrice: 300, currentPrice: 300 },
  ])

  const [totalValue, setTotalValue] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setHoldings(prevHoldings => 
        prevHoldings.map(holding => ({
          ...holding,
          currentPrice: holding.currentPrice * (1 + (Math.random() - 0.5) * 0.02) // Simulate price changes
        }))
      )
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const newTotalValue = holdings.reduce((total, holding) => 
      total + holding.quantity * holding.currentPrice, 0
    )
    setTotalValue(newTotalValue)
  }, [holdings])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">${totalValue.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
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
                const value = holding.quantity * holding.currentPrice
                const gainLoss = value - (holding.quantity * holding.purchasePrice)
                return (
                  <TableRow key={holding.symbol}>
                    <TableCell>{holding.symbol}</TableCell>
                    <TableCell>{holding.quantity}</TableCell>
                    <TableCell>${holding.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell>${holding.currentPrice.toFixed(2)}</TableCell>
                    <TableCell>${value.toFixed(2)}</TableCell>
                    <TableCell className={gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${gainLoss.toFixed(2)}
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

