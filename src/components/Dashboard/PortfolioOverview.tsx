import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight} from 'lucide-react'

export default function PortfolioOverview() {
  return (
    <div className="w-full md:w-1/2 xl:w-1/3 px-6 py-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$124,765.89</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4" /> +2.5%
            </span>
            From last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

