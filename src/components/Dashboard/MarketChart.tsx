'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Bar, BarChart, ReferenceLine } from 'recharts';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, CandlestickChart } from 'lucide-react';
import type { ChartDataPoint } from '@/types/trading';

interface MarketChartProps {
  data: ChartDataPoint[];
  symbol: string;
  currentPrice: number;
  onTimeframeChange?: (timeframe: string) => void;
}

export function MarketChart({ data, symbol, currentPrice, onTimeframeChange }: MarketChartProps) {
  const [timeframe, setTimeframe] = useState<'15m' | '1h' | '4h' | '1d'>('1h');
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');

  const handleTimeframeChange = (newTimeframe: typeof timeframe) => {
    setTimeframe(newTimeframe);
    if (onTimeframeChange) {
      onTimeframeChange(newTimeframe);
    }
  };

  const chartData = data.map((point, idx) => {
    const prevPoint = idx > 0 ? data[idx - 1] : null;
    return {
      time: new Date(point.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false,
      }),
      price: point.price,
      open: prevPoint ? prevPoint.price : point.price,
      high: point.price * 1.002, // Approximate high
      low: point.price * 0.998,  // Approximate low
      close: point.price,
      volume: point.volume || 0,
      timestamp: point.timestamp.getTime(),
      color: prevPoint && point.price >= prevPoint.price ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-3))',
    };
  });

  // Calculate price change
  const firstPrice = chartData[0]?.price || currentPrice;
  const lastPrice = chartData[chartData.length - 1]?.price || currentPrice;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = ((priceChange / firstPrice) * 100).toFixed(2);
  const isPositive = priceChange >= 0;

  const chartConfig = {
    price: {
      label: 'Price',
      color: 'hsl(var(--chart-1))',
    },
    volume: {
      label: 'Volume',
      color: 'hsl(var(--chart-4))',
    },
  };

  return (
    <Card className="card-glass hover-lift">
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {symbol} Price Chart
                <div className={`flex items-center gap-1 text-sm font-normal ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {isPositive ? '+' : ''}{priceChangePercent}%
                </div>
              </CardTitle>
              <p className="text-2xl font-bold mt-1">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(currentPrice)}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
                className="border-border/50"
              >
                Line
              </Button>
              <Button
                variant={chartType === 'candlestick' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('candlestick')}
                className="border-border/50"
              >
                <CandlestickChart className="h-4 w-4 mr-1" />
                Candles
              </Button>
            </div>
          </div>

          <Tabs value={timeframe} onValueChange={(v) => handleTimeframeChange(v as typeof timeframe)}>
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
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: 'currentColor', fontSize: 11 }}
                  tickLine={{ stroke: 'currentColor' }}
                  axisLine={{ stroke: 'currentColor', strokeWidth: 0.5 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: 'currentColor', fontSize: 11 }}
                  tickLine={{ stroke: 'currentColor' }}
                  axisLine={{ stroke: 'currentColor', strokeWidth: 0.5 }}
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
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
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: 'currentColor', fontSize: 11 }}
                  tickLine={{ stroke: 'currentColor' }}
                  axisLine={{ stroke: 'currentColor', strokeWidth: 0.5 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: 'currentColor', fontSize: 11 }}
                  tickLine={{ stroke: 'currentColor' }}
                  axisLine={{ stroke: 'currentColor', strokeWidth: 0.5 }}
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {data.time}
                              </span>
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">O: ${data.open.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground">H: ${data.high.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground">L: ${data.low.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground">C: ${data.close.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="price"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
