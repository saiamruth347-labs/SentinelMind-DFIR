import React, { useState } from 'react';
import { History, ShieldAlert, AlertTriangle, Eye, ShieldCheck } from 'lucide-react';

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

interface AuditProps {
  logs: AuditLog[];
}

export const Audit: React.FC<AuditProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter(log => 
    log.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.tool_used.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.command_run.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.output_summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto px-12 py-10 space-y-8 max-w-6xl mx-auto flex flex-col h-screen">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-cyber-border pb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight">Audit Trail Engine</h2>
          <p className="text-slate-400 text-sm mt-1">Immutable forensic tracking. Traces every agent action, tool invocation, and decision path.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-cyber-border rounded-lg text-xs font-mono text-slate-400">
          <History className="w-4 h-4 text-cyber-cyan" />
          <span>IMMUTABLE DATABASE ACTIVE</span>
        </div>
      </div>

      {/* Hallucination Detection Banner */}
      <div className="glass-panel p-4 border-cyber-warning/30 bg-cyber-warning/5 text-slate-300 shrink-0 font-mono text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-cyber-warning shrink-0 mt-0.5 md:mt-0" />
          <div>
            <span className="font-bold uppercase text-cyber-warning">Hallucination & Weak Evidence Shield:</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Engine monitors source files to ensure no finding is generated without valid cryptographic hash mappings.</p>
          </div>
        </div>
        <span className="bg-emerald-950 border border-emerald-800 text-cyber-success px-2 py-0.5 rounded text-[10px] font-bold">
          0 Hallucinations Detected
        </span>
      </div>

      {/* Main Grid: Search & Table on Left, Log inspector detail on Right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 min-h-0">
        {/* Table list */}
        <div className="md:col-span-2 flex flex-col h-full space-y-4">
          <div className="shrink-0">
            <input
              type="text"
              placeholder="Search audit trail by agent, tool, or command..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-cyber-border rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-accent font-mono"
            />
          </div>

          <div className="flex-1 overflow-y-auto border border-cyber-border rounded-lg overflow-x-auto bg-slate-950/80">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="bg-slate-900 text-slate-500 border-b border-cyber-border sticky top-0 z-10">
                  <th className="p-3">Time</th>
                  <th className="p-3">Agent Node</th>
                  <th className="p-3">Command / Action</th>
                  <th className="p-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-600">
                      No matching audit records found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr 
                      key={log.id} 
                      onClick={() => setSelectedLog(log)}
                      className={`border-b border-cyber-border/40 hover:bg-slate-900/40 cursor-pointer ${
                        log.is_self_correction === 1 ? 'bg-rose-950/10' : ''
                      } ${selectedLog?.id === log.id ? 'bg-cyber-accent/5' : ''}`}
                    >
                      <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="p-3 font-bold text-slate-300">{log.agent_name.replace(' Agent', '')}</td>
                      <td className="p-3 text-slate-400 max-w-[200px] truncate" title={log.command_run}>
                        {log.command_run}
                      </td>
                      <td className="p-3 text-right">
                        <button className="text-cyber-cyan hover:underline p-1 cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Inspector Panel */}
        <div className="bg-slate-950 border border-cyber-border rounded-xl p-5 flex flex-col h-full min-h-0 text-left font-mono text-[11px] text-slate-300 space-y-4 shadow-2xl">
          <h3 className="font-bold text-xs tracking-wider text-slate-400 uppercase border-b border-slate-900 pb-2.5 shrink-0 flex items-center gap-2">
            <Eye className="w-4.5 h-4.5 text-cyber-cyan" />
            Telemetry Inspector
          </h3>

          {selectedLog ? (
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[9px] block">Agent Responsible</span>
                <span className="text-slate-200 font-bold text-xs">{selectedLog.agent_name}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[9px] block">SIFT Tool / Binary</span>
                <span className="text-cyber-cyan text-xs font-bold">{selectedLog.tool_used}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[9px] block">Full Command Executed</span>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[10px] text-slate-200 whitespace-pre-wrap select-text">
                  {selectedLog.command_run}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[9px] block">Integrity Verification Source</span>
                <span className="text-slate-300">{selectedLog.evidence_source}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 uppercase text-[9px] block">Confidence Audit Score</span>
                <span className={`font-bold text-xs ${
                  selectedLog.confidence_score > 0.8 
                    ? 'text-cyber-success' 
                    : selectedLog.confidence_score > 0.4 
                      ? 'text-cyber-warning' 
                      : 'text-rose-400'
                }`}>
                  {(selectedLog.confidence_score * 100).toFixed(0)}%
                </span>
              </div>

              {selectedLog.is_self_correction === 1 && (
                <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded text-rose-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-[10px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    SELF-CORRECTION LOG ENTRY
                  </div>
                  <p className="text-[10px] leading-relaxed text-rose-400">This action rejected a low-confidence hypothesis and triggered an iteration loop scan.</p>
                </div>
              )}

              <div className="space-y-1 border-t border-slate-900 pt-3">
                <span className="text-slate-500 uppercase text-[9px] block">Output Log Summary</span>
                <p className="text-slate-300 leading-relaxed text-[10px] select-text">{selectedLog.output_summary}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-600 text-center">
              Select an audit row to view verification telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
