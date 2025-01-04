'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const AVAILABLE_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
]

export default function AddStockHoldingForm({ onStockAdded }: { onStockAdded: () => void }) {
  const [symbol, setSymbol] = useState('')
  const [quantity, setQuantity] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [loading, setLoading] = useState(false)
  
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('stock_holdings')
        .insert([
          {
            user_id: user.id,
            symbol,
            quantity: parseInt(quantity),
            purchase_price: parseFloat(purchasePrice)
          }
        ])

      if (error) throw error

      // Reset form
      setSymbol('')
      setQuantity('')
      setPurchasePrice('')
      onStockAdded() // Refresh the list
    } catch (error) {
      console.error('Error adding stock:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="symbol">Stock</Label>
        <Select value={symbol} onValueChange={setSymbol}>
          <SelectTrigger>
            <SelectValue placeholder="Select a stock" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_STOCKS.map((stock) => (
              <SelectItem key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
        <Input
          id="purchasePrice"
          type="number"
          step="0.01"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Stock Holding'}
      </Button>
    </form>
  )
}

