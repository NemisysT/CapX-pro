'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'

interface StockHolding {
  id: string
  symbol: string
  quantity: number
  purchase_price: number
}

export default function StockHoldingsList() {
  const [holdings, setHoldings] = useState<StockHolding[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [editForm, setEditForm] = useState({
    quantity: 0,
    purchase_price: 0
  })

  const supabase = createClientComponentClient()

  const fetchHoldings = async () => {
    try {
      const { data, error } = await supabase
        .from('stock_holdings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setHoldings(data || [])
    } catch (error) {
      console.error('Error fetching holdings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHoldings()
  }, [])

  const handleEdit = (holding: StockHolding) => {
    setEditingId(holding.id)
    setEditForm({
      quantity: holding.quantity,
      purchase_price: holding.purchase_price
    })
  }

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stock_holdings')
        .update({
          quantity: editForm.quantity,
          purchase_price: editForm.purchase_price
        })
        .eq('id', id)

      if (error) throw error
      
      fetchHoldings()
      setEditingId(null)
    } catch (error) {
      console.error('Error updating holding:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stock_holdings')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      fetchHoldings()
    } catch (error) {
      console.error('Error deleting holding:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-black via-gray-800 to-gray-900 p-6 rounded-lg shadow-lg"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-300">Symbol</TableHead>
            <TableHead className="text-gray-300">Quantity</TableHead>
            <TableHead className="text-gray-300">Purchase Price</TableHead>
            <TableHead className="text-gray-300">Total Value</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map(holding => (
            <TableRow key={holding.id}>
              <TableCell className="text-gray-300">{holding.symbol}</TableCell>
              <TableCell className="text-gray-300">
                {editingId === holding.id ? (
                  <Input 
                    type="number" 
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      quantity: parseInt(e.target.value)
                    })}
                    className="w-20 bg-gray-700 text-gray-300"
                  />
                ) : (
                  holding.quantity
                )}
              </TableCell>
              <TableCell className="text-gray-300">
                {editingId === holding.id ? (
                  <Input 
                    type="number" 
                    step="0.01"
                    value={editForm.purchase_price}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      purchase_price: parseFloat(e.target.value)
                    })}
                    className="w-24 bg-gray-700 text-gray-300"
                  />
                ) : (
                  `$${holding.purchase_price.toFixed(2)}`
                )}
              </TableCell>
              <TableCell className="text-gray-300">
                ${(holding.quantity * holding.purchase_price).toFixed(2)}
              </TableCell>
              <TableCell className="text-gray-300">
                {editingId === holding.id ? (
                  <>
                    <Button onClick={() => handleSave(holding.id)} className="mr-2 bg-gray-700 text-gray-300 hover:bg-gray-600">Save</Button>
                    <Button onClick={() => setEditingId(null)} variant="outline" className="bg-gray-700 text-gray-300 hover:bg-gray-600">Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => handleEdit(holding)} className="mr-2 bg-gray-700 text-gray-300 hover:bg-gray-600">Edit</Button>
                    <Button onClick={() => handleDelete(holding.id)} variant="destructive" className="bg-gray-700 text-gray-300 hover:bg-gray-600">Delete</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  )
}

