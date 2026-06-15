import React from 'react';
import { RealTimeTerminal } from '../components/RealTimeTerminal';
import { Terminal, Shield, Cpu, Activity as ActivityIcon } from 'lucide-react';

interface ActivityProps {
  logs: any[];
  status: string;
}

export const Activity: React.FC<ActivityProps> = ({ logs, status }) => {
  const agentsList = [
    { name: 'Evidence Collector Agent', role: 'Telemetry ingestion & hash verification', status: logs.some(l => l.agent_name === 'Evidence Collector Agent') ? 'Completed' : 'Idle' },
    { name: 'Memory Analysis Agent', role: 'Scans processes, DLLs, netscan outputs', status: logs.some(l => l.agent_name === 'Memory Analysis Agent') ? 'Completed' : 'Idle' },
    { name: 'Timeline Analyst Agent', role: 'Constructs timelines and event logs (evtx)', status: logs.some(l => l.agent_name === 'Timeline Analyst Agent') ? 'Completed' : 'Idle' },
    { name: 'Correlation Agent', role: 'Cross-correlates multi-source evidence', status: logs.some(l => l.agent_name === 'Correlation Agent') ? 'Completed' : 'Idle' },
    { name: 'Skeptic Agent', role: 'Flags anomalies & rejects weak hypotheses', status: logs.some(l => l.agent_name === 'Skeptic Agent') ? 'Completed' : 'Idle' },
    { name: 'Report Agent', role: 'Compiles the final incident report markdown', status: logs.some(l => l.agent_name === 'Report Agent') ? 'Completed' : 'Idle' }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-12 py-10 space-y-8 max-w-6xl mx-auto flex flex-col h-screen">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-cyber-border pb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight">Agent Activity Shell</h2>
          <p className="text-slate-400 text-sm mt-1">Live terminal logs documenting autonomous multi-agent tool execution on SIFT.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-cyber-border rounded-lg text-xs font-mono text-slate-400">
          <ActivityIcon className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
          <span>REAL-TIME STREAMING ACTIVE</span>
        </div>
      </div>

      {/* Grid: Shell Terminal on Left, Agent Status Panel on Right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 min-h-0">
        {/* Terminal Shell */}
        <div className="md:col-span-2 flex flex-col h-full min-h-0">
          <RealTimeTerminal logs={logs} status={status} />
        </div>

        {/* Right Info: Agent Cluster status */}
        <div className="space-y-6 overflow-y-auto pr-2">
          <div className="glass-panel p-5 space-y-4">
            <h3 className="font-bold font-mono text-xs tracking-wider text-slate-300 uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyber-cyan" />
              Agent Cluster Control
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              SentinelMind orchestrates a cluster of 6 autonomous LLM agents that execute SIFT CLI tools (volatility, evtx_dump, Plaso) within sandboxed, read-only constraints.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold font-mono text-xs tracking-wider text-slate-500 uppercase">Agent Nodes Status</h3>
            <div className="space-y-3">
              {agentsList.map((agent, index) => (
                <div key={index} className="glass-panel p-4 flex items-start justify-between border-slate-900/60 bg-cyber-card/40 hover:bg-cyber-card/60 transition-colors">
                  <div className="space-y-1 text-left max-w-[180px]">
                    <div className="text-xs font-bold text-slate-200 truncate">{agent.name}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{agent.role}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                    agent.status === 'Completed'
                      ? 'bg-emerald-950/40 border border-emerald-800/40 text-cyber-success'
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
