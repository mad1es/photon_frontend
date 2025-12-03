'use client';

import { KPICards } from '@/components/Dashboard/KPICards';
import { MarketChart } from '@/components/Dashboard/MarketChart';
import { AgentStatus } from '@/components/Dashboard/AgentStatus';
import { MessageLog } from '@/components/Dashboard/MessageLog';
import {
  mockAgents,
  mockMessages,
  mockPortfolio,
  mockChartData,
  mockMarketData,
} from '@/lib/mock-data';

export default function DashboardPage() {
  const currentPrice = mockMarketData[mockMarketData.length - 1]?.price || 150.32;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        <KPICards
          balance={mockPortfolio.balance}
          todayPnL={mockPortfolio.todayPnL}
          winRate={68.5}
          agentsStatus="All Active"
        />
        <MarketChart data={mockChartData} symbol="AAPL" currentPrice={currentPrice} />
        <AgentStatus agents={mockAgents} />
        <MessageLog messages={mockMessages} />
      </div>
    </div>
  );
}
