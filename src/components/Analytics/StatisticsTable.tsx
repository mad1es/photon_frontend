'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import type { PerformanceMetrics } from '@/types/trading';

interface StatisticsTableProps {
  metrics: PerformanceMetrics;
}

export function StatisticsTable({ metrics }: StatisticsTableProps) {
  const stats = [
    { label: 'Total Trades', value: metrics.totalTrades.toString() },
    { label: 'Winning Trades', value: metrics.winningTrades.toString() },
    { label: 'Losing Trades', value: metrics.losingTrades.toString() },
    { label: 'Win Rate', value: `${metrics.winRate.toFixed(1)}%` },
    { label: 'Avg Win', value: formatCurrency(metrics.avgWin) },
    { label: 'Avg Loss', value: formatCurrency(metrics.avgLoss) },
    { label: 'Win/Loss Ratio', value: `${metrics.winLossRatio.toFixed(2)}:1` },
    { label: 'Profit Factor', value: metrics.profitFactor.toFixed(2) },
    { label: 'Sharpe Ratio', value: metrics.sharpeRatio.toFixed(2) },
    { label: 'Max Drawdown', value: formatCurrency(metrics.maxDrawdown) },
    { label: 'Total Return', value: formatCurrency(metrics.totalReturn) },
    { label: 'Return %', value: `+${metrics.returnPercent.toFixed(1)}%` },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics Table</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat) => (
              <TableRow key={stat.label}>
                <TableCell className="font-medium">{stat.label}</TableCell>
                <TableCell className="text-right">{stat.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

