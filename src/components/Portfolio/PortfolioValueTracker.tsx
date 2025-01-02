'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface StockData {
  symbol: string
  quantity: number
  purchasePrice: number
  currentPrice: number
}

export default function PortfolioValueTracker() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [totalValue, setTotalValue] = useState(0)

  useEffect(() => {
    const socket = new WebSocket('wss://ws.finnhub.io?token=ctra2qpr01qhb16mdk1gctra2qpr01qhb16mdk20')

    socket.onopen = () => {
      console.log('WebSocket connection opened.')
      // Subscribe to stock symbols
      const initialStocks = [
        { symbol: 'AAPL', quantity: 10, purchasePrice: 150 },
        { symbol: 'GOOGL', quantity: 5, purchasePrice: 2500 },
        { symbol: 'MSFT', quantity: 15, purchasePrice: 300 },
      ]
      setStocks(initialStocks)
      initialStocks.forEach((stock) => {
        socket.send(JSON.stringify({ type: 'subscribe', symbol: stock.symbol }))
      })
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'trade') {
        const updates = data.data.reduce((acc: Record<string, number>, trade: { s: string; p: number }) => {
          acc[trade.s] = trade.p
          return acc
        }, {})

        setStocks((prevStocks) =>
          prevStocks.map((stock) => ({
            ...stock,
            currentPrice: updates[stock.symbol] || stock.currentPrice || stock.purchasePrice,
          }))
        )
      }
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    socket.onclose = () => {
      console.log('WebSocket connection closed.')
    }

    return () => socket.close()
  }, [])

  useEffect(() => {
    const newTotalValue = stocks.reduce((total, stock) =>
      total + stock.quantity * (stock.currentPrice || stock.purchasePrice), 0
    )
    setTotalValue(newTotalValue)
  }, [stocks])

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
              {stocks.map((stock) => {
                const currentPrice = stock.currentPrice || stock.purchasePrice
                const value = stock.quantity * currentPrice
                const gainLoss = value - (stock.quantity * stock.purchasePrice)
                return (
                  <TableRow key={stock.symbol}>
                    <TableCell>{stock.symbol}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>${stock.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell>${currentPrice.toFixed(2)}</TableCell>
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
