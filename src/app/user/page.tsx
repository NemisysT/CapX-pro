'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Header from '@/components/Dashboard/Header'
import Sidebar from '@/components/Dashboard/Sidebar'
import UserInfo from '@/components/Profile/UserInfo'
import DashboardSummary from '@/components/Profile/DashboardSummary'
import StockHoldingsSummary from '@/components/Profile/StockHoldingsSummary'
import PortfolioValueSummary from '@/components/Profile/PortfolioValueSummary'
import EmptyStateHandler from "@/components/shared/EmptyStateHandler"

export default function UserProfilePage() {
  const [hasHoldings, setHasHoldings] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkHoldings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from('stock_holdings')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)

        setHasHoldings(data && data.length > 0)
      } catch (error) {
        console.error('Error checking holdings:', error)
      } finally {
        setLoading(false)
      }
    }

    checkHoldings()
  }, [supabase])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-white text-black">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-black text-3xl font-medium mb-6">User Profile</h3>
            {hasHoldings ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UserInfo />
                <DashboardSummary />
                <StockHoldingsSummary />
                <PortfolioValueSummary />
              </div>
            ) : (
              <EmptyStateHandler 
                title="Welcome to Your Profile"
                message="Start by adding some stocks to see your portfolio summary"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

