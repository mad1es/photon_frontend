'use client';

import { PerformanceMetrics } from '@/components/Analytics/PerformanceMetrics';
import { PnLCurve } from '@/components/Analytics/PnLCurve';
import { StatisticsTable } from '@/components/Analytics/StatisticsTable';
import { MonthlyBreakdown } from '@/components/Analytics/MonthlyBreakdown';
import { mockPerformanceMetrics, mockPortfolio } from '@/lib/mock-data';

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      <div className="space-y-4">
        <PerformanceMetrics metrics={mockPerformanceMetrics} />
        <PnLCurve initialBalance={10000} currentBalance={mockPortfolio.balance} />
        <div className="grid gap-4 md:grid-cols-2">
          <StatisticsTable metrics={mockPerformanceMetrics} />
          <MonthlyBreakdown />
        </div>
      </div>
    </div>
  );
}

