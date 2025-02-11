'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Header from '@/components/Dashboard/Header'
import Sidebar from '@/components/Dashboard/Sidebar'
import PortfolioOverview from '@/components/Dashboard/PortfolioOverview'
import PerformanceChart from '@/components/Dashboard/PerformanceChart'
import AssetAllocation from '@/components/Dashboard/AssetAllocation'
import RecentTransactions from '@/components/Dashboard/RecentTransaction'
import EmptyStateHandler from '@/components/shared/EmptyStateHandler'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const [hasHoldings, setHasHoldings] = useState<boolean | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkHoldings = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('stock_holdings')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      setHasHoldings(data && data.length > 0)
    }

    checkHoldings()
  }, [supabase])

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {hasHoldings === false ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700"
            >
              <EmptyStateHandler 
                title="Welcome to Your Investment Dashboard!"
                message="Get started by adding your first stock to track your portfolio."
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-[1600px] mx-auto"
            >
              <h3 className="text-gray-100 text-3xl font-medium mb-8 px-4">Dashboard</h3>
              
              {/* Top Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 px-4">
                <div className="lg:col-span-4">
                  <PortfolioOverview />
                </div>
                <div className="lg:col-span-8">
                  <PerformanceChart />
                </div>
              </div>
              
              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
                <div className="lg:col-span-4">
                  <AssetAllocation />
                </div>
                <div className="lg:col-span-8">
                  <RecentTransactions />
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
