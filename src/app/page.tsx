import Header from '@/components/Dashboard/Header'
import Sidebar from '@/components/Dashboard/Sidebar'
import PortfolioOverview from '@/components/Dashboard/PortfolioOverview'
import PerformanceChart from '@/components/Dashboard/PerformanceChart'
import AssetAllocation from '@/components/Dashboard/AssetAllocation'
import RecentTransactions from '@/components/Dashboard/RecentTransaction'

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
            <div className="mt-4">
              <div className="flex flex-wrap -mx-6">
                <PortfolioOverview />
                <PerformanceChart />
                <AssetAllocation />
                <RecentTransactions />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

