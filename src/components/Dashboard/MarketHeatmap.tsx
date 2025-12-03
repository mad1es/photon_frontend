'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MarketData } from '@/types/trading';
import { cn } from '@/lib/utils';

interface MarketHeatmapProps {
  marketData: MarketData[];
}

export function MarketHeatmap({ marketData }: MarketHeatmapProps) {
  // Get top gainers and losers
  const sortedData = [...marketData]
    .sort((a, b) => (b.price - b.previousPrice) - (a.price - a.previousPrice))
    .slice(0, 10);

  const topGainers = sortedData.filter((item) => item.price > item.previousPrice).slice(0, 5);
  const topLosers = sortedData
    .filter((item) => item.price < item.previousPrice)
    .reverse()
    .slice(0, 5);

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
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
              <TrendingUp className="h-4 w-4 text-green-400" />
              <h4 className="font-semibold text-sm">Top Gainers</h4>
            </div>
            {topGainers.map((item) => {
              const change = calculateChange(item.price, item.previousPrice);
              const intensity = getIntensity(change);

              return (
                <div
                  key={item.symbol}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border transition-colors',
                    intensity === 'high' && 'bg-green-500/20 border-green-500/30',
                    intensity === 'medium' && 'bg-green-500/10 border-green-500/20',
                    intensity === 'low' && 'bg-card/50 border-border/50'
                  )}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{item.symbol}</div>
                    <div className="text-xs text-muted-foreground">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm text-green-400">
                      +{change.toFixed(2)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Vol: {item.volume}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top Losers */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-4 w-4 text-red-400" />
              <h4 className="font-semibold text-sm">Top Losers</h4>
            </div>
            {topLosers.map((item) => {
              const change = calculateChange(item.price, item.previousPrice);
              const intensity = getIntensity(Math.abs(change));

              return (
                <div
                  key={item.symbol}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border transition-colors',
                    intensity === 'high' && 'bg-red-500/20 border-red-500/30',
                    intensity === 'medium' && 'bg-red-500/10 border-red-500/20',
                    intensity === 'low' && 'bg-card/50 border-border/50'
                  )}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{item.symbol}</div>
                    <div className="text-xs text-muted-foreground">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm text-red-400">
                      {change.toFixed(2)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Vol: {item.volume}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

