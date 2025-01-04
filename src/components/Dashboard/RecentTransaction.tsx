'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import EmptyStateHandler from "@/components/shared/EmptyStateHandler"

interface Transaction {
  id: string
  symbol: string
  quantity: number
  purchase_price: number
  created_at: string
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from('stock_holdings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        if (data) {
          setTransactions(data)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }

    fetchTransactions()
    const interval = setInterval(fetchTransactions, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  if (loading) return <div>Loading...</div>

  if (!loading && transactions.length === 0) {
    return (
      <div className="w-full xl:w-2/3 px-6 py-3">
        <Card>
          <CardContent>
            <EmptyStateHandler 
              title="No Recent Transactions"
              message="Add some stocks to see your transaction history"
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full xl:w-2/3 px-6 py-3">
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center">
                
                <div className="flex-1">
                  <p className="text-sm font-medium">{transaction.symbol}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm font-medium">
                  ${(transaction.quantity * transaction.purchase_price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

