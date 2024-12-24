import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StockHoldingsSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Holdings Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Total Holdings:</strong> 5 stocks</p>
          <p><strong>Most Valuable Holding:</strong> AAPL (35% of portfolio)</p>
          <p><strong>Recently Added:</strong> MSFT (15 shares)</p>
          <p><strong>Best Performer:</strong> GOOGL (+15% since purchase)</p>
        </div>
      </CardContent>
    </Card>
  )
}

