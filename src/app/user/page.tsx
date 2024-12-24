import Header from '@/components/Dashboard/Header'
import Sidebar from '@/components/Dashboard/Sidebar'
import UserInfo from '@/components/Profile/UserInfo'
import DashboardSummary from '@/components/Profile/DashboardSummary'
import StockHoldingsSummary from '@/components/Profile/StockHoldingsSummary'
import PortfolioValueSummary from '@/components/Profile/PortfolioValueSummary'

export default function UserProfilePage() {
  return (
    <div className="flex h-screen bg-white text-black">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-black text-3xl font-medium mb-6">User Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UserInfo />
              <DashboardSummary />
              <StockHoldingsSummary />
              <PortfolioValueSummary />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

