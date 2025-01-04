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
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {hasHoldings === false ? (
              <div className="bg-white rounded-lg shadow p-6">
                <EmptyStateHandler 
                  title="Welcome to Your Investment Dashboard!"
                  message="Get started by adding your first stock to track your portfolio."
                />
              </div>
            ) : (
              <>
                <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
                <div className="mt-4">
                  <div className="flex flex-wrap -mx-6">
                    <PortfolioOverview />
                    <PerformanceChart />
                    <AssetAllocation />
                    <RecentTransactions />
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
