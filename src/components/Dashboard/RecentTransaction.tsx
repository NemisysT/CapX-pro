import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const transactions = [
  { type: 'Buy', asset: 'AAPL', amount: '$1,000', date: '2023-06-01' },
  { type: 'Sell', asset: 'GOOGL', amount: '$1,500', date: '2023-05-28' },
  { type: 'Buy', asset: 'MSFT', amount: '$800', date: '2023-05-25' },
]

export default function RecentTransactions() {
  return (
    <div className="w-full xl:w-2/3 px-6 py-3">
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div key={index} className="flex items-center">
                <div className={`rounded-full p-2 ${transaction.type === 'Buy' ? 'bg-green-100' : 'bg-red-100'} mr-4`}>
                  {transaction.type === 'Buy' ? (
                    <ArrowUpRight className={`h-4 w-4 ${transaction.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`} />
                  ) : (
                    <ArrowDownRight className={`h-4 w-4 ${transaction.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{transaction.asset}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
                <div className="text-sm font-medium">{transaction.amount}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

