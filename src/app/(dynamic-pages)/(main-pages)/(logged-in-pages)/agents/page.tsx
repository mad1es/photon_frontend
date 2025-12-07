'use client';

import { AgentDetailCards } from '@/components/Agents/AgentDetailCards';
import { MessageTimeline } from '@/components/Agents/MessageTimeline';
import { CommunicationFlow } from '@/components/Agents/CommunicationFlow';
import { useAgents, useMessages } from '@/hooks/use-agents';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AgentsPage() {
  const { agents, loading: agentsLoading, error: agentsError } = useAgents();
  const { messages, loading: messagesLoading, error: messagesError } = useMessages(50);

  if (agentsLoading && agents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-8" />
          <p className="text-muted-foreground">Loading agents data...</p>
        </div>
      </div>
    );
  }

  if (agentsError && agents.length === 0) {
    return (
      <div className="flex-1 p-4 md:p-8 pt-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading agents</AlertTitle>
          <AlertDescription>{agentsError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
      </div>

      {(agentsError || messagesError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{agentsError || messagesError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <AgentDetailCards agents={agents} />
        <div className="grid gap-4 md:grid-cols-2">
          <MessageTimeline messages={messages} />
          <CommunicationFlow />
        </div>
      </div>
    </div>
  );
}

