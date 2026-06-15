import React, { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Play, RefreshCw, AlertTriangle } from 'lucide-react';

interface AuditLog {
  id: number;
  timestamp: string;
  agent_name: string;
  action: string;
  tool_used: string;
  command_run: string;
  evidence_source: string;
  output_summary: string;
  confidence_score: number;
  is_self_correction: number;
}

interface RealTimeTerminalProps {
  logs: AuditLog[];
  status: string;
}

export const RealTimeTerminal: React.FC<RealTimeTerminalProps> = ({ logs, status }) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'Evidence Collector Agent': return 'text-sky-400';
      case 'Memory Analysis Agent': return 'text-violet-400';
      case 'Timeline Analyst Agent': return 'text-amber-400';
      case 'Correlation Agent': return 'text-emerald-400';
      case 'Skeptic Agent': return 'text-rose-400 font-bold';
      case 'Report Agent': return 'text-cyan-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-cyber-border rounded-xl overflow-hidden font-mono text-xs shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-cyber-cyan" />
          <span className="font-bold text-slate-300">SENTINELMIND AGENT SHELL</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[300px] max-h-[500px]">
        <div className="text-slate-500">SentinelMind DFIR agent daemon active. Initialized successfully.</div>
        
        {logs.map((log) => (
          <div key={log.id} className="space-y-1 select-text">
            {/* Timestamp & Agent header */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className={`${getAgentColor(log.agent_name)}`}>{log.agent_name}</span>
              <span className="text-slate-600">&gt;</span>
              <span className="text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-[10px]">
                {log.tool_used}
              </span>
            </div>

            {/* Simulated SIFT Command line */}
            <div className="pl-4 text-cyber-cyan font-bold flex items-center gap-1.5">
              <span>$</span>
              <span>{log.command_run}</span>
            </div>

            {/* Self-Correction Warning */}
            {log.is_self_correction === 1 && (
              <div className="ml-4 mr-2 my-1.5 p-2 bg-rose-950/40 border border-rose-800/50 rounded flex items-center gap-2 text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <div>
                  <span className="font-bold uppercase text-xs">SELF-CORRECTION EVENT TRIGGERED:</span> Hypotheses rejected. Launching iteration query.
                </div>
              </div>
            )}

            {/* Output details */}
            <div className="pl-4 text-slate-300 whitespace-pre-wrap leading-relaxed">
              {log.output_summary}
            </div>

            {/* Confidence metric */}
            <div className="pl-4 text-[10px] text-slate-500 flex items-center gap-4">
              <span>Confidence: <strong className={log.confidence_score > 0.8 ? 'text-cyber-success' : log.confidence_score > 0.4 ? 'text-cyber-warning' : 'text-cyber-error'}>{(log.confidence_score * 100).toFixed(0)}%</strong></span>
              <span>Source: <span className="text-slate-400">{log.evidence_source}</span></span>
            </div>
          </div>
        ))}

        {status === 'Running' && (
          <div className="flex items-center gap-2 text-cyber-cyan animate-pulse pl-2 mt-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Agent cluster correlating logs and verifying hypotheses...</span>
            <span className="terminal-cursor"></span>
          </div>
        )}

        {status === 'Completed' && (
          <div className="text-cyber-success font-bold mt-4 border-t border-emerald-950 pt-2 flex items-center gap-2">
            <span>[+] Incident analysis sequence complete. Findings compiled in registry.</span>
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
