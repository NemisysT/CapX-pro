'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'

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
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4 bg-gradient-to-br from-black via-gray-800 to-gray-900 p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <Label htmlFor="symbol" className="text-gray-300">Stock</Label>
        <Select value={symbol} onValueChange={setSymbol}>
          <SelectTrigger className="bg-gray-700 text-gray-300">
            <SelectValue placeholder="Select a stock" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 text-gray-300">
            {AVAILABLE_STOCKS.map((stock) => (
              <SelectItem key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="quantity" className="text-gray-300">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="bg-gray-700 text-gray-300"
        />
      </div>
      <div>
        <Label htmlFor="purchasePrice" className="text-gray-300">Purchase Price ($)</Label>
        <Input
          id="purchasePrice"
          type="number"
          step="0.01"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          required
          className="bg-gray-700 text-gray-300"
        />
      </div>
      <Button type="submit" disabled={loading} className="bg-gray-700 text-gray-300 hover:bg-gray-600">
        {loading ? 'Adding...' : 'Add Stock Holding'}
      </Button>
    </motion.form>
  )
}

