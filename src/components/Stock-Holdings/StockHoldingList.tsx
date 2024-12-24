'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface StockHolding {
  id: number
  symbol: string
  quantity: number
  purchasePrice: number
}

export default function StockHoldingsList() {
  const [holdings, setHoldings] = useState<StockHolding[]>([
    { id: 1, symbol: 'AAPL', quantity: 10, purchasePrice: 150 },
    { id: 2, symbol: 'GOOGL', quantity: 5, purchasePrice: 2500 },
  ])
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleEdit = (id: number) => {
    setEditingId(id)
  }

  const handleSave = (id: number, updatedHolding: Partial<StockHolding>) => {
    setHoldings(holdings.map(holding => 
      holding.id === id ? { ...holding, ...updatedHolding } : holding
    ))
    setEditingId(null)
  }

  const handleDelete = (id: number) => {
    setHoldings(holdings.filter(holding => holding.id !== id))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Purchase Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.map(holding => (
          <TableRow key={holding.id}>
            <TableCell>{holding.symbol}</TableCell>
            <TableCell>
              {editingId === holding.id ? (
                <Input 
                  type="number" 
                  value={holding.quantity}
                  onChange={(e) => handleSave(holding.id, { quantity: parseInt(e.target.value) })}
                  className="w-20"
                />
              ) : (
                holding.quantity
              )}
            </TableCell>
            <TableCell>
              {editingId === holding.id ? (
                <Input 
                  type="number" 
                  value={holding.purchasePrice}
                  onChange={(e) => handleSave(holding.id, { purchasePrice: parseFloat(e.target.value) })}
                  className="w-24"
                />
              ) : (
                `$${holding.purchasePrice.toFixed(2)}`
              )}
            </TableCell>
            <TableCell>
              {editingId === holding.id ? (
                <Button onClick={() => setEditingId(null)}>Done</Button>
              ) : (
                <>
                  <Button onClick={() => handleEdit(holding.id)} className="mr-2">Edit</Button>
                  <Button onClick={() => handleDelete(holding.id)} variant="destructive">Delete</Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

