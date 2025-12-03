'use client';

import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface PortfolioSummaryProps {
  balance: number;
  freeCash: number;
  usedMargin: number;
  totalTrades: number;
  todayPnL: number;
  totalPnL: number;
}

export function PortfolioSummary({
  balance,
  freeCash,
  usedMargin,
  totalTrades,
  todayPnL,
  totalPnL,
}: PortfolioSummaryProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div>
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-lg font-semibold">{formatCurrency(balance)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Free Cash</p>
            <p className="text-lg font-semibold">{formatCurrency(freeCash)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Used Margin</p>
            <p className="text-lg font-semibold">{formatCurrency(usedMargin)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Trades</p>
            <p className="text-lg font-semibold">{totalTrades}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Today's P&L</p>
            <p
              className={`text-lg font-semibold ${
                todayPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {todayPnL >= 0 ? '+' : ''}
              {formatCurrency(todayPnL)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total P&L</p>
            <p
              className={`text-lg font-semibold ${
                totalPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {totalPnL >= 0 ? '+' : ''}
              {formatCurrency(totalPnL)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

