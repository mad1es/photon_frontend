'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export function MonthlyBreakdown() {
  const breakdown = [
    { period: 'Today', pnl: 245 },
    { period: 'Yesterday', pnl: 125 },
    { period: 'This Week', pnl: 1245 },
    { period: 'Dec 2024', pnl: 1450 },
    { period: 'Nov 2024', pnl: 1000 },
    { period: 'Oct 2024', pnl: 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {breakdown.map((item) => (
            <div key={item.period} className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">{item.period}</p>
              <p
                className={`text-lg font-semibold ${
                  item.pnl >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {item.pnl >= 0 ? '+' : ''}
                {formatCurrency(item.pnl)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

