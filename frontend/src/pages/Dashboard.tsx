import React from 'react';
import { InvestigationGraph } from '../components/InvestigationGraph';
import { TimelineChart } from '../components/TimelineChart';
import { ShieldAlert, Server, Calendar, Clock, Terminal, AlertCircle } from 'lucide-react';

interface DashboardProps {
  logs: any[];
  findings: any[];
  status: string;
  targetHost: string;
  setActivePage: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ logs, findings, status, targetHost, setActivePage }) => {
  const latestLog = logs[logs.length - 1];

  return (
    <div className="flex-1 overflow-y-auto px-12 py-10 space-y-8 max-w-6xl mx-auto">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center border-b border-cyber-border pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight">Triage Operations Centre</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time status of the multi-agent incident triage and threat correlation.</p>
        </div>
        <div className={`px-4 py-2 rounded-lg border font-mono text-xs flex items-center gap-2 ${
          status === 'Completed' 
            ? 'bg-emerald-950/30 border-cyber-success text-cyber-success' 
            : 'bg-sky-950/30 border-cyber-accent text-cyber-accent animate-pulse'
        }`}>
          <div className={`w-2 h-2 rounded-full ${status === 'Completed' ? 'bg-cyber-success' : 'bg-cyber-accent animate-ping'}`}></div>
          <span>ENGINE STATUS: {status.toUpperCase()}</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-5 space-y-2">
          <span className="text-[10px] text-slate-500 font-mono uppercase">Target Host</span>
          <div className="flex items-center gap-2 text-slate-200">
            <Server className="w-5 h-5 text-cyber-cyan" />
            <span className="font-bold text-sm">{targetHost}</span>
          </div>
        </div>
        <div className="glass-panel p-5 space-y-2">
          <span className="text-[10px] text-slate-500 font-mono uppercase">Threat Index</span>
          <div className="flex items-center gap-2 text-slate-200">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span className="font-bold text-sm">
              {findings.some(f => f.severity === 'Critical') ? 'CRITICAL RISK' : 'MEDIUM RISK'}
            </span>
          </div>
        </div>
        <div className="glass-panel p-5 space-y-2">
          <span className="text-[10px] text-slate-500 font-mono uppercase">Agent Invocations</span>
          <div className="flex items-center gap-2 text-slate-200">
            <Terminal className="w-5 h-5 text-cyber-accent" />
            <span className="font-bold text-sm">{logs.length} Actions Logged</span>
          </div>
        </div>
        <div className="glass-panel p-5 space-y-2">
          <span className="text-[10px] text-slate-500 font-mono uppercase">Verification Rate</span>
          <div className="flex items-center gap-2 text-slate-200">
            <Clock className="w-5 h-5 text-cyber-cyan" />
            <span className="font-bold text-sm">
              {findings.length > 0 
                ? `${((findings.filter(f => f.status === 'Confirmed').length / findings.length) * 100).toFixed(0)}% Confirmed`
                : 'Evaluating...'}
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Agent Workflow Visualizer */}
      <div className="space-y-4">
        <h3 className="font-bold font-mono text-xs tracking-wider text-slate-400 uppercase">Agent Correlation Topology</h3>
        <InvestigationGraph logs={logs} status={status} />
      </div>

      {/* Middle Grid: Telemetry Chart & Current Findings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Recharts Timeline */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-bold font-mono text-xs tracking-wider text-slate-400 uppercase">Incident Timeline</h3>
          <TimelineChart />
        </div>

        {/* Current Findings */}
        <div className="space-y-4 flex flex-col h-full">
          <h3 className="font-bold font-mono text-xs tracking-wider text-slate-400 uppercase">Triage Findings</h3>
          <div className="glass-panel p-4 flex-1 space-y-3 overflow-y-auto max-h-[250px]">
            {findings.length === 0 ? (
              <div className="text-slate-500 text-center py-12 text-xs font-mono">
                Running forensic analysis...
              </div>
            ) : (
              findings.map((f, i) => (
                <div key={i} className={`p-3 rounded-lg border text-xs space-y-1.5 transition-all duration-300 ${
                  f.severity === 'Critical' 
                    ? 'bg-rose-950/20 border-rose-800/40 text-rose-200' 
                    : f.status === 'Unverified' 
                      ? 'bg-slate-900 border-slate-800 text-slate-400 opacity-60' 
                      : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                }`}>
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold uppercase truncate max-w-[150px]">{f.title}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      f.status === 'Confirmed' 
                        ? 'bg-emerald-950 border border-emerald-800 text-cyber-success'
                        : f.status === 'Unverified'
                          ? 'bg-slate-800 border border-slate-700 text-slate-400'
                          : 'bg-amber-950 border border-amber-800 text-cyber-warning'
                    }`}>
                      {f.status}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-slate-300 text-[10px] leading-relaxed">{f.description}</p>
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>Severity: {f.severity}</span>
                    <span>Confidence: {(f.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer / Shell logs link */}
      {latestLog && (
        <div className="glass-panel p-4 flex items-center justify-between border-cyber-accent/10">
          <div className="flex items-center gap-3 font-mono text-xs">
            <Terminal className="w-5 h-5 text-cyber-cyan shrink-0" />
            <div className="truncate max-w-2xl">
              <span className="text-slate-500">[{latestLog.agent_name}]:</span>{' '}
              <span className="text-slate-300 font-bold">{latestLog.command_run}</span>{' '}
              <span className="text-slate-400">- {latestLog.output_summary}</span>
            </div>
          </div>
          <button 
            onClick={() => setActivePage('activity')}
            className="text-xs text-cyber-accent font-bold hover:underline font-mono ml-4 shrink-0"
          >
            VIEW FULL SHELL LOGS &gt;
          </button>
        </div>
      )}
    </div>
  );
};
