import Header from '@/components/Dashboard/Header'
import Sidebar from '@/components/Dashboard/Sidebar'
import StockHoldingsList from '@/components/Stock-Holdings/StockHoldingList'
import AddStockHoldingForm from '@/components/Stock-Holdings/AddStockHoldingForm'

export default function StockHoldingsPage() {
  return (
    <div className="flex h-screen bg-white text-black">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-black text-3xl font-medium">Stock Holdings</h3>
            <div className="mt-8">
              <AddStockHoldingForm />
            </div>
            <div className="mt-8">
              <StockHoldingsList />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

