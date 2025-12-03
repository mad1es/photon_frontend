'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Brain, Zap, Clock, Activity } from 'lucide-react';
import { Agent } from '@/types/trading';
import { cn } from '@/lib/utils';

interface LiveAgentStatusCardProps {
  agent: Agent;
  index: number;
}

const agentConfig = [
  {
    name: 'Market Monitor',
    icon: BarChart3,
    gradient: 'bg-gradient-blue',
    description: 'Monitors financial market data',
  },
  {
    name: 'Decision Maker',
    icon: Brain,
    gradient: 'bg-gradient-yellow',
    description: 'Analyzes data and makes decisions',
  },
  {
    name: 'Executor',
    icon: Zap,
    gradient: 'bg-gradient-green',
    description: 'Executes trades and records actions',
  },
];

export function LiveAgentStatusCard({ agent, index }: LiveAgentStatusCardProps) {
  const config = agentConfig[index];
  const Icon = config.icon;
  const isOnline = agent.status === 'active';

  return (
    <Card className="card-glass hover-lift">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('h-10 w-10 rounded-full flex items-center justify-center', config.gradient)}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">{config.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{config.description}</p>
            </div>
          </div>
          <Badge
            variant={isOnline ? 'default' : 'secondary'}
            className={cn(
              isOnline && 'bg-green-500/20 text-green-400 border-green-500/50'
            )}
          >
            <div className={cn('h-2 w-2 rounded-full mr-1.5', isOnline ? 'bg-green-400' : 'bg-gray-400')} />
            {isOnline ? 'Online' : 'Idle'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {index === 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monitoring</span>
              <span className="font-medium">15 exchanges</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Data points/min</span>
              <span className="font-medium">2,450</span>
            </div>
          </div>
        )}
        {index === 1 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium">Analyzing</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next decision</span>
              <span className="font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                30 sec
              </span>
            </div>
          </div>
        )}
        {index === 2 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium">Idle</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last trade</span>
              <span className="font-medium text-green-400">BTC +2.5%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Time ago</span>
              <span className="font-medium">12 min</span>
            </div>
          </div>
        )}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Last updated
            </span>
            <span className="font-medium">
              {typeof agent.lastUpdated === 'string' 
                ? new Date(agent.lastUpdated).toLocaleTimeString()
                : agent.lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface LiveAgentStatusCardsProps {
  agents: Agent[];
}

export function LiveAgentStatusCards({ agents }: LiveAgentStatusCardsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Live Agent Status</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {agents.map((agent, index) => (
          <LiveAgentStatusCard key={agent.id} agent={agent} index={index} />
        ))}
      </div>
    </div>
  );
}

