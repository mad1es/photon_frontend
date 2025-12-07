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

  const getGradient = () => {
    switch (agent.type) {
      case 'market':
        return 'bg-gradient-blue';
      case 'decision':
        return 'bg-gradient-yellow';
      case 'execution':
        return 'bg-gradient-green';
      default:
        return 'bg-gradient-primary';
    }
  };

  return (
    <Card className="card-glass hover-lift relative border-l-2 border-l-primary/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', getGradient())}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg">{agent.name}</CardTitle>
          </div>
          <Badge 
            variant={agent.status === 'active' ? 'default' : 'secondary'}
            className={cn(
              agent.status === 'active' && 'bg-green-500/20 text-green-400 border-green-500/50',
              agent.status === 'idle' && 'bg-gray-500/20 text-gray-400 border-gray-500/50',
              agent.status === 'error' && 'bg-red-500/20 text-red-400 border-red-500/50'
            )}
          >
            {agent.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Messages Processed</p>
          <p className="text-2xl font-bold tracking-tight">{agent.messagesProcessed}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Last Action</p>
          <p className="text-sm font-medium">{agent.lastAction}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Last Updated</p>
          <p className="text-sm font-medium">
            {new Date(agent.lastUpdated).toLocaleString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </p>
        </div>
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Recent Logs</p>
          <div className="space-y-1.5">
            {agent.logs.slice(0, 3).map((log, idx) => (
              <div key={idx} className="text-xs text-muted-foreground font-mono">
                [{new Date(log.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}] {log.message}
              </div>
            ))}
          </div>
        </div>
        <Button variant="outline" className="w-full border-border/50 hover:bg-primary/10" asChild>
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

