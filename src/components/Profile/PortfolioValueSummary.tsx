import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PortfolioValueSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Value Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Current Total Value:</strong> $124,765.89</p>
          <p><strong>Today&apos;s Change:</strong> <span className="text-green-600">+$1,234.56 (+1.2%)</span></p>
          <p><strong>All-Time High:</strong> $130,000.00 (May 15, 2023)</p>
          <p><strong>All-Time Low:</strong> $95,000.00 (Jan 1, 2023)</p>
        </div>
      </CardContent>
    </Card>
  )
}

