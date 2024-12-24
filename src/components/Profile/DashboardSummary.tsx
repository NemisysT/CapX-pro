import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Total Portfolio Value:</strong> $124,765.89</p>
          <p><strong>Monthly Change:</strong> <span className="text-green-600">+2.5%</span></p>
          <p><strong>Top Performing Stock:</strong> AAPL (+5.2%)</p>
          <p><strong>Recent Transaction:</strong> Bought 10 MSFT @ $300.00</p>
        </div>
      </CardContent>
    </Card>
  )
}

