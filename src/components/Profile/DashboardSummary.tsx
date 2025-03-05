'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import EmptyStateHandler from "@/components/shared/EmptyStateHandler";
import { motion } from 'framer-motion';

interface StockPerformance {
  symbol: string;
  percentageChange: number;
}

interface RecentTransaction {
  id: string;
  symbol: string;
  quantity: number;
  purchase_price: number;
  created_at: string;
}

export default function DashboardSummary() {
  const [totalValue, setTotalValue] = useState(0);
  const [monthlyChange, setMonthlyChange] = useState(0);
  const [topStock, setTopStock] = useState<StockPerformance | null>(null);
  const [recentTransaction, setRecentTransaction] = useState<RecentTransaction | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClientComponentClient();
  const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch holdings
        const { data: holdings } = await supabase
          .from('stock_holdings')
          .select('*')
          .eq('user_id', user.id);

        if (!holdings || holdings.length === 0) {
          setLoading(false);
          return;
        }

        // Calculate total value and find performance
        let currentTotal = 0;
        const stockPerformances: StockPerformance[] = [];

        for (const holding of holdings) {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${holding.symbol}&token=${FINNHUB_API_KEY}`
          );
          const data = await response.json();
          const currentPrice = data.c || holding.purchase_price;
          const value = holding.quantity * currentPrice;
          currentTotal += value;

          const percentageChange = ((currentPrice - holding.purchase_price) / holding.purchase_price) * 100;
          stockPerformances.push({
            symbol: holding.symbol,
            percentageChange
          });
        }

        // Set total value
        setTotalValue(currentTotal);

        // Set monthly change (using a simplified calculation)
        setMonthlyChange(((currentTotal - (currentTotal * 0.95)) / (currentTotal * 0.95)) * 100);

        // Find top performing stock
        const topPerformer = stockPerformances.reduce((prev, current) => 
          prev.percentageChange > current.percentageChange ? prev : current
        );
        setTopStock(topPerformer);

        // Get most recent transaction
        const { data: recentTx } = await supabase
          .from('stock_holdings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        setRecentTransaction(recentTx);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [FINNHUB_API_KEY, supabase]);

  if (loading) return <div className="text-center">Loading...</div>;

  if (!loading && (!totalValue || totalValue === 0)) {
    return (
      <Card className="bg-gray-800 text-white">
        <CardContent>
          <EmptyStateHandler />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-900 text-white shadow-lg border border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Dashboard Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-lg"><strong>Total Portfolio Value:</strong></p>
              <p className="text-xl font-bold text-green-500">${totalValue.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg"><strong>Monthly Change:</strong></p>
              <p className={`text-xl font-semibold ${monthlyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(2)}%
              </p>
            </div>

            {topStock && (
              <div className="flex justify-between items-center">
                <p className="text-lg"><strong>Top Performing Stock:</strong></p>
                <p className="text-xl font-semibold">
                  {topStock.symbol} (
                  <span className={topStock.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {topStock.percentageChange >= 0 ? '+' : ''}{topStock.percentageChange.toFixed(2)}%
                  </span>)
                </p>
              </div>
            )}

            {recentTransaction && (
              <div className="flex justify-between items-center">
                <p className="text-lg"><strong>Recent Transaction:</strong></p>
                <p className="text-xl font-semibold">
                  Bought {recentTransaction.quantity} {recentTransaction.symbol} @ 
                  ${recentTransaction.purchase_price.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}