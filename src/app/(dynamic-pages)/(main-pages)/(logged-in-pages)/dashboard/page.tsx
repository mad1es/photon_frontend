'use client';

import { Suspense } from 'react';
import { KPICards } from '@/components/Dashboard/KPICards';
import { MarketChart } from '@/components/Dashboard/MarketChart';
import { LiveAgentStatusCards } from '@/components/Dashboard/LiveAgentStatusCards';
import { TradeActivityFeed } from '@/components/Dashboard/TradeActivityFeed';
import { MarketHeatmap } from '@/components/Dashboard/MarketHeatmap';
import { MessageLog } from '@/components/Dashboard/MessageLog';
import {
  mockAgents,
  mockMessages,
  mockPortfolio,
  mockChartData,
  mockMarketData,
  mockTrades,
} from '@/lib/mock-data';

function DashboardContent() {
  const currentPrice = mockMarketData[mockMarketData.length - 1]?.price || 150.32;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">Monitor your multi-agent trading system in real-time</p>
        </div>
      </div>
      
      {/* Portfolio Summary & KPIs */}
      <div className="space-y-4">
        <KPICards
          balance={mockPortfolio.balance}
          todayPnL={mockPortfolio.todayPnL}
          winRate={68.5}
          agentsStatus="All Active"
        />
      </div>

      {/* Live Agent Status Cards */}
      <LiveAgentStatusCards agents={mockAgents} />

      {/* Market Chart & Heatmap Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MarketChart data={mockChartData} symbol="AAPL" currentPrice={currentPrice} />
        <MarketHeatmap marketData={mockMarketData} />
      </div>

      {/* Trade Activity Feed & Agent Communication Log */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TradeActivityFeed trades={mockTrades} />
        <MessageLog messages={mockMessages} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-8">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
