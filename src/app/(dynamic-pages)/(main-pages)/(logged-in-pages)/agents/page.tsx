'use client';

import { Suspense } from 'react';
import { AgentDetailCards } from '@/components/Agents/AgentDetailCards';
import { MessageTimeline } from '@/components/Agents/MessageTimeline';
import { CommunicationFlow } from '@/components/Agents/CommunicationFlow';
import { mockAgents, mockMessages } from '@/lib/mock-data';

function AgentsContent() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
      </div>
      <div className="space-y-4">
        <AgentDetailCards agents={mockAgents} />
        <div className="grid gap-4 md:grid-cols-2">
          <MessageTimeline messages={mockMessages} />
          <CommunicationFlow />
        </div>
      </div>
    </div>
  );
}

export default function AgentsPage() {
  return (
    <Suspense fallback={<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">Loading...</div>}>
      <AgentsContent />
    </Suspense>
  );
}

