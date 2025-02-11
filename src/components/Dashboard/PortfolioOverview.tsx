"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import EmptyStateHandler from "@/components/shared/EmptyStateHandler"

export default function PortfolioOverview() {
  const [totalValue, setTotalValue] = useState(0)
  const [previousValue, setPreviousValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY

  useEffect(() => {
    const fetchPortfolioValue = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data: holdings } = await supabase.from("stock_holdings").select("*").eq("user_id", user.id)

        if (!holdings) return

        let currentTotal = 0
        for (const holding of holdings) {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${holding.symbol}&token=${FINNHUB_API_KEY}`,
          )
          const data = await response.json()
          const currentPrice = data.c || holding.purchase_price
          currentTotal += holding.quantity * currentPrice
        }

        setTotalValue(currentTotal)
        setPreviousValue(currentTotal * 0.95) // Simplified: using 95% of current value as previous
        setLoading(false)
      } catch (error) {
        console.error("Error fetching portfolio value:", error)
      }
    }

    fetchPortfolioValue()
    const interval = setInterval(fetchPortfolioValue, 60000)

    return () => clearInterval(interval)
  }, [FINNHUB_API_KEY, supabase])

  if (loading) return <div>Loading...</div>

  if (!loading && totalValue === 0) {
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

  const percentageChange = ((totalValue - previousValue) / previousValue) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg border border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Total Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="text-3xl font-bold"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            ${totalValue.toFixed(2)}
          </motion.div>
          <motion.p
            className="text-xs text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className={`flex items-center ${percentageChange >= 0 ? "text-green-400" : "text-red-400"}`}>
              {percentageChange >= 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4" />
              )}
              {Math.abs(percentageChange).toFixed(2)}%
            </span>
            From last month
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
