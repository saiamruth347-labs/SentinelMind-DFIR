import React, { useMemo } from 'react';
import { RefreshCw, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, CornerDownRight } from 'lucide-react';

interface CorrectionProps {
  logs: any[];
}

export const Correction: React.FC<CorrectionProps> = ({ logs }) => {
  const isCorrectionStarted = useMemo(() => {
    return logs.some(l => l.is_self_correction === 1 || l.agent_name === 'Skeptic Agent');
  }, [logs]);

  const isCompleted = useMemo(() => {
    return logs.some(l => l.agent_name === 'Report Agent');
  }, [logs]);

  return (
    <div className="flex-1 overflow-y-auto px-12 py-10 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-cyber-border pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight">Self-Correction Timeline</h2>
          <p className="text-slate-400 text-sm mt-1">Autonomous reasoning verification. Visualizes hypothesis rejection and re-investigation loops.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-purple-950/20 border border-purple-800 px-3 py-1.5 rounded-lg text-purple-400 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
          <span>REASONING AUDITOR ENGAGED</span>
        </div>
      </div>

      {/* Main Timeline Sequence */}
      <div className="space-y-8 relative before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
        
        {/* Step 1: Initial Hypothesis */}
        <div className="relative pl-16 flex flex-col md:flex-row gap-6 items-start">
          <div className="absolute left-4 top-1.5 w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center font-mono text-xs text-slate-400 z-10">
            1
          </div>
          <div className="flex-1 glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-200 uppercase font-mono">Iteration 1: Initial Threat Triage</h4>
              <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                Confidence: 60%
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Formed Hypothesis:</strong> Ingested memory dump. Found <code>svchost.exe</code> (PID 4920) running from Public Downloads folder with active outbound connections. Initial hypothesis suggests a system administrator manual diagnostics utility.
            </p>
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-500 space-y-1">
              <div>[SUPPORTING EVIDENCE] Non-standard folder path, but no privilege escalation event detected.</div>
              <div>[ALTERNATIVE CONSIDERED] Remote Access Trojan (RAT). Rejected initially due to lack of known service bindings.</div>
            </div>
          </div>
        </div>

        {/* Step 2: Skeptic Challenge */}
        <div className={`relative pl-16 flex flex-col md:flex-row gap-6 items-start transition-all duration-500 ${
          isCorrectionStarted ? 'opacity-100' : 'opacity-30'
        }`}>
          <div className={`absolute left-4 top-1.5 w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs z-10 ${
            isCorrectionStarted ? 'bg-rose-950 border-2 border-rose-600 text-rose-400' : 'bg-slate-900 border-2 border-slate-800 text-slate-600'
          }`}>
            2
          </div>
          <div className="flex-1 glass-panel p-6 space-y-4 border-rose-950/40">
            <div className="flex items-center justify-between">
              <h4 className={`font-bold text-sm uppercase font-mono ${isCorrectionStarted ? 'text-rose-400' : 'text-slate-500'}`}>
                Iteration 2: Skeptic Audit Challenge
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                isCorrectionStarted ? 'bg-rose-950/50 border border-rose-800/40 text-rose-400' : 'bg-slate-900 text-slate-600'
              }`}>
                Confidence: 15% (CRITICAL DROP)
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Skeptic Agent Challenge:</strong> Rejected initial hypothesis. Auditor correlated event logs pointing to a brute-force remote login from IP 185.220.101.44 (the same destination IP of the outbound C2 connection). Additionally, standard admin diagnostic tools do not trigger Cobalt Strike memory Yara signatures.
            </p>
            {isCorrectionStarted && (
              <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-900/30 text-[10px] font-mono text-rose-300 space-y-1">
                <div>[INCONSISTENCY DETECTED] Legitimate admins do not brute-force local accounts from Tor exit nodes.</div>
                <div>[SELF-CORRECTION ACTION] Halt current flow. Query SIFT registry sub-system for persistence indicators.</div>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Re-Investigation */}
        <div className={`relative pl-16 flex flex-col md:flex-row gap-6 items-start transition-all duration-500 ${
          isCorrectionStarted ? 'opacity-100' : 'opacity-30'
        }`}>
          <div className={`absolute left-4 top-1.5 w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs z-10 ${
            isCorrectionStarted ? 'bg-amber-950 border-2 border-amber-600 text-amber-400' : 'bg-slate-900 border-2 border-slate-800 text-slate-600'
          }`}>
            3
          </div>
          <div className="flex-1 glass-panel p-6 space-y-4 border-amber-950/40">
            <div className="flex items-center justify-between">
              <h4 className={`font-bold text-sm uppercase font-mono ${isCorrectionStarted ? 'text-amber-400' : 'text-slate-500'}`}>
                Iteration 3: Autonomous Re-Investigation
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                isCorrectionStarted ? 'bg-amber-950/50 border border-amber-800/40 text-amber-400' : 'bg-slate-900 text-slate-600'
              }`}>
                Confidence: 85%
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Registry & Task Audit:</strong> Invoked <code>rip.pl</code> (SIFT registry parser). Found registry startup Run key <code>WindowsUpdateAgent</code> and Scheduled Task <code>TelemetrySync</code> both pointing to <code>svchost.exe</code> (PID 4920) for automated persistence.
            </p>
            {isCorrectionStarted && (
              <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-900/30 text-[10px] font-mono text-amber-300 space-y-1">
                <div>[NEW EVIDENCE] Verified registry Run key created 2026-06-15T23:35:10Z.</div>
                <div>[NEW EVIDENCE] Verified Scheduled Task 'TelemetrySync' trigger active at system boot.</div>
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Final Conclusion */}
        <div className={`relative pl-16 flex flex-col md:flex-row gap-6 items-start transition-all duration-500 ${
          isCompleted ? 'opacity-100' : 'opacity-30'
        }`}>
          <div className={`absolute left-4 top-1.5 w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs z-10 ${
            isCompleted ? 'bg-emerald-950 border-2 border-emerald-600 text-cyber-success' : 'bg-slate-900 border-2 border-slate-800 text-slate-600'
          }`}>
            4
          </div>
          <div className="flex-1 glass-panel p-6 space-y-4 border-emerald-950/40">
            <div className="flex items-center justify-between">
              <h4 className={`font-bold text-sm uppercase font-mono ${isCompleted ? 'text-cyber-success' : 'text-slate-500'}`}>
                Iteration 4: Final Corrected Conclusion
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                isCompleted ? 'bg-emerald-950/50 border border-emerald-800/40 text-cyber-success' : 'bg-slate-900 text-slate-600'
              }`}>
                Confidence: 98% (CONFIRMED THREAT)
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Cobalt Strike Intrusion Confirmed:</strong> Integrated process networking, brute force event correlation, service installation history, and Run key persistence. Attacker breached host via brute force, registered service and run keys for persistence, and executed Cobalt Strike C2 agent.
            </p>
            {isCompleted && (
              <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/30 text-[10px] font-mono text-cyber-success space-y-1">
                <div>[CONCLUSION STATUS] Confirmed threat vectors. Audit trail locked.</div>
                <div>[REASONING REPORT] Verified: Outbound C2 (100%), Local Persistence (100%), Credentials compromised (100%).</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
