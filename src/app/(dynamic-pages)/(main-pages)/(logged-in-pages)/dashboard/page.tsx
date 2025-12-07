'use client';

import { useState } from 'react';
import { KPICards } from '@/components/Dashboard/KPICards';
import { MarketChart } from '@/components/Dashboard/MarketChart';
import { LiveAgentStatusCards } from '@/components/Dashboard/LiveAgentStatusCards';
import { TradeActivityFeed } from '@/components/Dashboard/TradeActivityFeed';
import { MarketHeatmap } from '@/components/Dashboard/MarketHeatmap';
import { MessageLog } from '@/components/Dashboard/MessageLog';
import { useDashboard } from '@/hooks/use-dashboard';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function DashboardContent() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1h');
  const { data, loading, error } = useDashboard(selectedSymbol, selectedTimeframe);

  if (loading && !data) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-8" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex-1 p-4 md:p-8 pt-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading dashboard</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">Monitor your multi-agent trading system in real-time</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Portfolio Summary & KPIs */}
      <div className="space-y-4">
        <KPICards
          balance={data.balance}
          todayPnL={data.todayPnL}
          winRate={data.winRate}
          agentsStatus={data.agentsStatus}
        />
      </div>

      {/* Live Agent Status Cards */}
      <LiveAgentStatusCards agents={data.agents} />

      {/* Market Chart & Heatmap Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MarketChart
          data={data.chartData}
          symbol={selectedSymbol}
          currentPrice={data.currentPrice}
        />
        <MarketHeatmap marketData={data.marketHeatmap} />
      </div>

      {/* Trade Activity Feed & Agent Communication Log */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TradeActivityFeed trades={data.trades} />
        <MessageLog messages={data.messages} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
