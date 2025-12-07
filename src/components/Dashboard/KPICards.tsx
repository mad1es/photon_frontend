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
    <Card className={cn('card-glass hover-lift', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {change && (
          <p
            className={cn(
              'text-xs mt-1.5',
              changeType === 'positive' && 'text-green-400',
              changeType === 'negative' && 'text-red-400',
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

  const initialBalance = 10000;
  const balanceChange = balance - initialBalance;
  const balanceChangePercent = (balanceChange / initialBalance) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        icon={Wallet}
        label="Portfolio Balance"
        value={formatCurrency(balance)}
        change={
          balanceChange !== 0
            ? `${balanceChange >= 0 ? '+' : ''}${formatCurrency(balanceChange)} (${balanceChangePercent >= 0 ? '+' : ''}${balanceChangePercent.toFixed(2)}%)`
            : undefined
        }
        changeType={balanceChange >= 0 ? 'positive' : balanceChange < 0 ? 'negative' : 'neutral'}
      />
      <KPICard
        icon={TrendingUp}
        label="Today's P&L"
        value={formatCurrency(todayPnL)}
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
        changeType="positive"
      />
    </div>
  );
}

