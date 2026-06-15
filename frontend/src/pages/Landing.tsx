import React, { useState } from 'react';
import { ShieldAlert, Server, Play, ChevronRight, CheckCircle2, Lock, Terminal } from 'lucide-react';

interface LandingProps {
  onStartInvestigation: (host: string) => void;
  isLoading: boolean;
}

export const Landing: React.FC<LandingProps> = ({ onStartInvestigation, isLoading }) => {
  const [host, setHost] = useState('WS-DFIR-STAGE01');

  return (
    <div className="flex-1 overflow-y-auto px-12 py-16 flex flex-col justify-center max-w-5xl mx-auto space-y-12">
      {/* Header Panel */}
      <div className="space-y-4 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-accent/10 border border-cyber-accent/30 rounded-full text-xs text-cyber-cyan font-mono tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>AUTONOMOUS CYBERSECURITY ANALYST</span>
        </div>
        <h2 className="text-5xl font-black tracking-tight text-glow-cyber text-slate-100 max-w-3xl leading-tight">
          Self-Correcting DFIR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent to-cyber-cyan">
            Autonomous Incident Response
          </span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
          SentinelMind operates directly on the SIFT Workstation. Using a Multi-Agent workflow, it gathers files, runs forensics, builds timelines, correlations, and is monitored by a Skeptic Agent to eliminate hallucinations and verify findings.
        </p>
      </div>

      {/* Target Host Ingestion Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input box */}
        <div className="glass-panel p-8 space-y-6 border-cyber-accent/20 neon-glow-blue">
          <h3 className="font-bold font-mono text-xs tracking-wider text-slate-300 uppercase">
            Start New Incident Triage
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] text-slate-500 font-mono mb-2 uppercase">
                Target Host / Disk Image Address
              </label>
              <div className="relative">
                <Server className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="w-full bg-slate-900 border border-cyber-border rounded-lg pl-11 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyber-accent font-mono transition-colors"
                  placeholder="Enter target IP or host"
                />
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-lg border border-cyber-border text-xs text-slate-400 space-y-2 font-mono">
              <div className="flex justify-between">
                <span>FORENSIC ENV:</span>
                <span className="text-cyber-cyan">SANS SIFT WORKSTATION</span>
              </div>
              <div className="flex justify-between">
                <span>PROTOCOL SIFT VERSION:</span>
                <span className="text-cyber-cyan">v1.2.4-MCP</span>
              </div>
              <div className="flex justify-between">
                <span>MAPPED LOGS:</span>
                <span className="text-slate-300">memdump.raw, Security.evtx</span>
              </div>
            </div>

            <button
              onClick={() => onStartInvestigation(host)}
              disabled={isLoading || !host}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-cyber-accent to-cyber-cyan hover:opacity-90 active:scale-[0.98] font-bold text-cyber-dark text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyber-accent/20 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>INITIALIZING AGENTS...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>DEPLOY SENTINELMIND ANALYSIS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feature Checkmarks */}
        <div className="space-y-6 py-2">
          <h3 className="font-bold text-xs tracking-wider text-slate-500 uppercase font-mono">
            Platform Capabilities
          </h3>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-cyber-cyan shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-200 text-sm">Autonomous Multi-Agent Loop</h4>
                <p className="text-xs text-slate-400 mt-0.5">Six specialized analysts share and cross-validate data from memory dump analysis to registry keys.</p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-cyber-cyan shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-200 text-sm">Self-Correcting Hypotheses</h4>
                <p className="text-xs text-slate-400 mt-0.5">The Skeptic Agent continuously audits findings, rejecting claims with low confidence or missing forensic integrity validation.</p>
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-cyber-cyan shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-200 text-sm">Forensic Traceability & Write Protection</h4>
                <p className="text-xs text-slate-400 mt-0.5">SentinelMind acts as a read-only process on evidence disks, documenting every command run in an immutable audit trail.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Simple helper to load loading spin icon
const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
