'use client';

import { PortfolioSummary } from '@/components/Portfolio/PortfolioSummary';
import { PositionTable } from '@/components/Portfolio/PositionTable';
import { TradeHistory } from '@/components/Portfolio/TradeHistory';
import { EquityCurve } from '@/components/Portfolio/EquityCurve';
import {
  mockPortfolio,
  mockPerformanceMetrics,
} from '@/lib/mock-data';

export default function PortfolioPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
      </div>
      <div className="space-y-4">
        <PortfolioSummary
          balance={mockPortfolio.balance}
          freeCash={mockPortfolio.freeCash}
          usedMargin={mockPortfolio.usedMargin}
          totalTrades={mockPortfolio.totalTrades}
          todayPnL={mockPortfolio.todayPnL}
          totalPnL={mockPortfolio.totalPnL}
        />
        <PositionTable positions={mockPortfolio.positions} />
        <TradeHistory trades={mockPortfolio.trades} />
        <EquityCurve
          initialBalance={10000}
          currentBalance={mockPortfolio.balance}
          maxDrawdown={mockPerformanceMetrics.maxDrawdown}
          sharpeRatio={mockPerformanceMetrics.sharpeRatio}
        />
      </div>
    </div>
  );
}

