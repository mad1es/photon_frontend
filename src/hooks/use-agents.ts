import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import type { Agent, Message } from '@/types/trading';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const agentsData = await apiClient.getAgentsDetail();

      const formattedAgents: Agent[] = (agentsData || []).map((agent) => ({
        id: String(agent.id || ''),
        type: agent.type === 'market' ? 'market' : agent.type === 'decision' ? 'decision' : 'execution',
        name: agent.name || 'Unknown Agent',
        status: agent.status === 'active' ? 'active' : agent.status === 'error' ? 'error' : 'idle',
        lastAction: agent.lastAction || 'No action',
        lastUpdated: new Date(agent.lastUpdated || new Date()),
        messagesProcessed: agent.messagesProcessed || 0,
        logs: (agent.logs || []).map((log) => ({
          timestamp: new Date(log.timestamp || new Date()),
          level: (log.level || 'INFO').toLowerCase() as 'info' | 'warning' | 'error',
          message: log.message || '',
        })),
      }));

      setAgents(formattedAgents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agents');
      console.error('Agents fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 10000);
    return () => clearInterval(interval);
  }, []);

  const startMarketMonitor = async () => {
    try {
      await apiClient.controlMarketMonitor('start');
      await fetchAgents();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to start market monitor');
    }
  };

  const stopMarketMonitor = async () => {
    try {
      await apiClient.controlMarketMonitor('stop');
      await fetchAgents();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to stop market monitor');
    }
  };

  return {
    agents,
    loading,
    error,
    refetch: fetchAgents,
    startMarketMonitor,
    stopMarketMonitor,
  };
}

export function useMessages(limit: number = 50) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const messagesData = await apiClient.getMessages(limit);

      const formattedMessages: Message[] = (messagesData || []).map((msg) => ({
        id: String(msg.id || ''),
        timestamp: new Date(msg.timestamp || new Date()),
        from: (msg.from || 'market') as 'market' | 'decision' | 'execution',
        to: (msg.to || 'market') as 'market' | 'decision' | 'execution',
        type: (msg.type || 'MARKET_SNAPSHOT') as 'MARKET_SNAPSHOT' | 'TRADE_DECISION' | 'EXECUTION_REPORT',
        payload: msg.payload || {},
      }));

      setMessages(formattedMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      console.error('Messages fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [limit]);

  return { messages, loading, error, refetch: fetchMessages };
}

