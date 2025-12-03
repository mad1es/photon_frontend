'use client';

import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import type { PerformanceMetrics as PerformanceMetricsType } from '@/types/trading';

interface PerformanceMetricsProps {
  metrics: PerformanceMetricsType;
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Return</p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              +{formatCurrency(metrics.totalReturn)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
            <p className="text-lg font-semibold">{metrics.sharpeRatio.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-lg font-semibold">{metrics.winRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Profit Factor</p>
            <p className="text-lg font-semibold">{metrics.profitFactor.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Max Drawdown</p>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              {formatCurrency(metrics.maxDrawdown)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Trades</p>
            <p className="text-lg font-semibold">{metrics.totalTrades}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

