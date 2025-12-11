'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketHeatmapProps {
  marketData: Array<{
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
  }>;
}

export function MarketHeatmap({ marketData }: MarketHeatmapProps) {
  if (!Array.isArray(marketData)) {
    return (
      <Card className="card-glass">
        <CardHeader>
          <CardTitle>Market Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No market data available</p>
        </CardContent>
      </Card>
    );
  }

  // Filter data with required fields and get top gainers and losers
  const validData = marketData.filter(
    (item) => item.symbol && item.price !== undefined && item.changePercent !== undefined
  );

  const sortedData = [...validData]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 10);

  const topGainers = sortedData.filter((item) => item.changePercent > 0).slice(0, 5);
  const topLosers = sortedData
    .filter((item) => item.changePercent < 0)
    .reverse()
    .slice(0, 5);

  const calculateChange = (changePercent: number) => {
    return changePercent;
  };

  const getIntensity = (change: number) => {
    const absChange = Math.abs(change);
    if (absChange > 10) return 'high';
    if (absChange > 5) return 'medium';
    return 'low';
  };

  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Market Heatmap</span>
          <Badge variant="outline" className="text-xs">
            Top Gainers / Losers
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Gainers */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-[var(--dashboard-profit)]" />
              <h4 className="font-semibold text-sm text-white dark:text-white text-black">Top Gainers</h4>
            </div>
            {topGainers.length === 0 ? (
              <p className="text-muted-foreground text-sm">No gainers available</p>
            ) : (
              topGainers.map((item) => {
                const change = calculateChange(item.changePercent);
                const intensity = getIntensity(change);

                return (
                  <div
                    key={item.symbol}
                    className="flex items-center justify-between p-3 rounded-lg border border-[var(--dashboard-profit)]/20 bg-[var(--dashboard-profit)]/5 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-white dark:text-white text-black">{item.symbol}</div>
                      <div className="text-xs text-white/50 dark:text-white/50 text-black/50">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm text-[var(--dashboard-profit)]">
                        +{change.toFixed(2)}%
                      </div>
                      <div className="text-xs text-white/50 dark:text-white/50 text-black/50">Vol: {item.volume}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Top Losers */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-4 w-4 text-[var(--dashboard-loss)]" />
              <h4 className="font-semibold text-sm text-white dark:text-white text-black">Top Losers</h4>
            </div>
            {topLosers.length === 0 ? (
              <p className="text-muted-foreground text-sm">No losers available</p>
            ) : (
              topLosers.map((item) => {
                const change = calculateChange(item.changePercent);
                const intensity = getIntensity(Math.abs(change));

                return (
                  <div
                    key={item.symbol}
                    className="flex items-center justify-between p-3 rounded-lg border border-[var(--dashboard-loss)]/20 bg-[var(--dashboard-loss)]/5 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-white dark:text-white text-black">{item.symbol}</div>
                      <div className="text-xs text-white/50 dark:text-white/50 text-black/50">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm text-[var(--dashboard-loss)]">
                        {change.toFixed(2)}%
                      </div>
                      <div className="text-xs text-white/50 dark:text-white/50 text-black/50">Vol: {item.volume}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



