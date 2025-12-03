'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

function KPICard({ icon: Icon, label, value, change, changeType = 'neutral', className }: KPICardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={cn(
              'text-xs mt-1',
              changeType === 'positive' && 'text-green-600 dark:text-green-400',
              changeType === 'negative' && 'text-red-600 dark:text-red-400',
              changeType === 'neutral' && 'text-muted-foreground'
            )}
          >
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface KPICardsProps {
  balance: number;
  todayPnL: number;
  winRate: number;
  agentsStatus: string;
}

export function KPICards({ balance, todayPnL, winRate, agentsStatus }: KPICardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        icon={Wallet}
        label="Portfolio Balance"
        value={formatCurrency(balance)}
        change={`+${formatCurrency(balance - 10000)} (+${((balance - 10000) / 10000 * 100).toFixed(2)}%)`}
        changeType="positive"
      />
      <KPICard
        icon={TrendingUp}
        label="Today's P&L"
        value={formatCurrency(todayPnL)}
        change="12 trades"
        changeType={todayPnL >= 0 ? 'positive' : 'negative'}
      />
      <KPICard
        icon={Target}
        label="Win Rate"
        value={formatPercent(winRate)}
        changeType="positive"
      />
      <KPICard
        icon={Zap}
        label="Agents Status"
        value={agentsStatus}
        change="3 active"
        changeType="positive"
      />
    </div>
  );
}

