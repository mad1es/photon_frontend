'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useState } from 'react';
import type { ChartDataPoint } from '@/types/trading';

interface MarketChartProps {
  data: ChartDataPoint[];
  symbol: string;
  currentPrice: number;
}

export function MarketChart({ data, symbol, currentPrice }: MarketChartProps) {
  const [timeframe, setTimeframe] = useState<'15m' | '1h' | '4h' | '1d'>('1h');

  const chartData = data.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    price: point.price,
    timestamp: point.timestamp.getTime(),
  }));

  const chartConfig = {
    price: {
      label: 'Price',
      color: 'hsl(var(--chart-1))',
    },
  };

  return (
    <Card className="card-glass hover-lift">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {symbol} Price Chart
            <span className="ml-2 text-lg font-normal text-muted-foreground">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(currentPrice)}
            </span>
          </CardTitle>
          <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as typeof timeframe)}>
            <TabsList className="bg-background/50 border border-border/50">
              <TabsTrigger value="15m" className="data-[state=active]:bg-primary/10">15m</TabsTrigger>
              <TabsTrigger value="1h" className="data-[state=active]:bg-primary/10">1h</TabsTrigger>
              <TabsTrigger value="4h" className="data-[state=active]:bg-primary/10">4h</TabsTrigger>
              <TabsTrigger value="1d" className="data-[state=active]:bg-primary/10">1d</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis
                dataKey="time"
                tick={{ fill: 'currentColor', fontSize: 12 }}
                tickLine={{ stroke: 'currentColor' }}
                axisLine={{ stroke: 'currentColor', strokeWidth: 0.5 }}
              />
              <YAxis
                tick={{ fill: 'currentColor', fontSize: 12 }}
                tickLine={{ stroke: 'currentColor' }}
                axisLine={{ stroke: 'currentColor', strokeWidth: 0.5 }}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'hsl(var(--chart-1))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

