'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Brain, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Agent } from '@/types/trading';
import Link from 'next/link';

interface AgentDetailCardProps {
  agent: Agent;
}

function AgentDetailCard({ agent }: AgentDetailCardProps) {
  const getIcon = () => {
    switch (agent.type) {
      case 'market':
        return Activity;
      case 'decision':
        return Brain;
      case 'execution':
        return Zap;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const Icon = getIcon();
  const statusColor = getStatusColor(agent.status);

  return (
    <Card className="relative">
      <div className={cn('absolute left-0 top-0 bottom-0 w-1 rounded-l-lg', statusColor)} />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <CardTitle>{agent.name}</CardTitle>
          </div>
          <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
            {agent.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Messages Processed</p>
          <p className="text-2xl font-bold">{agent.messagesProcessed}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Last Action</p>
          <p className="text-sm font-medium">{agent.lastAction}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Last Updated</p>
          <p className="text-sm font-medium">
            {new Date(agent.lastUpdated).toLocaleString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Recent Logs</p>
          <div className="space-y-1">
            {agent.logs.slice(0, 3).map((log, idx) => (
              <div key={idx} className="text-xs text-muted-foreground">
                [{new Date(log.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}] {log.message}
              </div>
            ))}
          </div>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/agents">View Logs</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

interface AgentDetailCardsProps {
  agents: Agent[];
}

export function AgentDetailCards({ agents }: AgentDetailCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {agents.map((agent) => (
        <AgentDetailCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}

