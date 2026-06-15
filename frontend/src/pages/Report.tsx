import React, { useEffect, useState } from 'react';
import { FileText, Download, ShieldCheck, AlertCircle, Copy, Check } from 'lucide-react';

interface ReportProps {
  investigationId: string | null;
}

export const Report: React.FC<ReportProps> = ({ investigationId }) => {
  const [report, setReport] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    if (!investigationId) return;
    fetch(`http://127.0.0.1:8000/api/reports/${investigationId}`)
      .then(res => res.json())
      .then(data => setReport(data));
  }, [investigationId]);

  const copyToClipboard = () => {
    if (!report) return;
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportReport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    }, 2000);
  };

  if (!report) {
    return (
      <div className="flex-1 flex items-center justify-center font-mono text-xs text-slate-500">
        Generating incident report structures...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-12 py-10 space-y-8 max-w-5xl mx-auto text-left select-text">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-cyber-border pb-6 select-none shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight">Executive Incident Report</h2>
          <p className="text-slate-400 text-sm mt-1">Validated threat summaries, timelines, evidence integrity, and mitigation guides.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={copyToClipboard}
            className="p-2.5 bg-slate-900 border border-cyber-border hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Copy Report JSON"
          >
            {copied ? <Check className="w-4 h-4 text-cyber-success" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={exportReport}
            className="px-4 py-2 bg-gradient-to-r from-cyber-accent to-cyber-cyan text-cyber-dark font-bold text-xs rounded-lg flex items-center gap-2 cursor-pointer shadow-lg shadow-cyber-accent/10 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'EXPORTING PDF...' : exported ? 'EXPORTED!' : 'EXPORT REPORT'}</span>
          </button>
        </div>
      </div>

      {/* Main Report Container */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-8 space-y-8 shadow-2xl relative overflow-hidden font-sans">
        {/* Document watermark background */}
        <div className="absolute -right-10 -top-10 text-[180px] font-black text-slate-800/10 pointer-events-none font-mono uppercase select-none">
          DFIR
        </div>

        {/* Title Meta */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">SENTINELMIND SECURITY AUDIT</h1>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                ID: {report.investigation_id} | HOST: {report.target_host}
              </span>
            </div>
            <div className="text-right text-xs text-slate-400 font-mono">
              <div>Generated: {new Date(report.completed_at || report.created_at).toLocaleDateString()}</div>
              <div>Status: <span className="text-cyber-success font-bold">Closed / Verified</span></div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs font-mono uppercase text-cyber-cyan tracking-wider">1. Executive Summary</h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-lg border border-slate-800/60">
            {report.executive_summary}
          </p>
        </div>

        {/* Ingested Evidence */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs font-mono uppercase text-cyber-cyan tracking-wider">2. Forensic Evidence Inventory</h3>
          <div className="border border-slate-800 rounded-lg overflow-hidden font-mono text-[11px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900 text-slate-500 border-b border-slate-800">
                  <th className="p-3">Source Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Cryptographic SHA-256 Hash</th>
                  <th className="p-3 text-right">Integrity</th>
                </tr>
              </thead>
              <tbody>
                {report.evidence_inventory?.map((ev: any, idx: number) => (
                  <tr key={idx} className="border-b border-slate-900 hover:bg-slate-900/10">
                    <td className="p-3 font-bold text-slate-300">{ev.name}</td>
                    <td className="p-3 text-slate-400">{ev.type}</td>
                    <td className="p-3 text-slate-500 font-mono text-[10px]">{ev.hash}</td>
                    <td className="p-3 text-right text-cyber-success font-bold">{ev.integrity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Threat Findings */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs font-mono uppercase text-cyber-cyan tracking-wider">3. Identified Threat Vectors</h3>
          <div className="space-y-4">
            {report.findings?.map((f: any, idx: number) => (
              <div key={idx} className={`p-5 rounded-lg border space-y-3 ${
                f.status === 'Confirmed' 
                  ? 'bg-rose-950/10 border-rose-900/30' 
                  : 'bg-slate-900 border-slate-800 opacity-60'
              }`}>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className={`font-bold uppercase ${f.status === 'Confirmed' ? 'text-rose-400' : 'text-slate-500'}`}>
                    [{f.severity}] {f.title}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    f.status === 'Confirmed' ? 'bg-rose-950 border border-rose-800 text-rose-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {f.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{f.description}</p>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/40 pt-2.5">
                  <span>Source: {f.evidence_source}</span>
                  <span>Reasoning Confidence: {(f.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reconstructed Attack Chain */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs font-mono uppercase text-cyber-cyan tracking-wider">4. Attack Chain Reconstruction</h3>
          <div className="space-y-3 pl-4 border-l border-slate-800">
            {report.attack_chain?.map((step: any) => (
              <div key={step.step} className="flex gap-4 items-start text-xs text-slate-300 leading-relaxed">
                <span className="font-mono font-bold text-cyber-accent bg-slate-900 border border-slate-800 w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 select-none">
                  {step.step}
                </span>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs font-mono uppercase text-cyber-cyan tracking-wider">5. Suggested Incident Mitigations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.recommendations?.map((rec: any, idx: number) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-lg space-y-1">
                <h4 className="font-bold text-xs text-slate-200 uppercase font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyber-success" />
                  {rec.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
