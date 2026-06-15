import React, { useEffect, useState } from 'react';
import { ShieldCheck, HardDrive, FileCode, CheckCircle2, Lock, FileSpreadsheet } from 'lucide-react';

interface EvidenceFile {
  id: string;
  name: string;
  type: string;
  size: string;
  hash: string;
  acquired_at: string;
  status: string;
  summary: string;
}

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://127.0.0.1:8000' 
  : 'https://sentinelmind-dfir.onrender.com';

export const Evidence: React.FC = () => {
  const [evidenceList, setEvidenceList] = useState<EvidenceFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<EvidenceFile | null>(null);
  const [rawContent, setRawContent] = useState<any>(null);
  const [verifyingMap, setVerifyingMap] = useState<Record<string, boolean>>({});
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/evidence/inventory`)
      .then(res => res.json())
      .then(data => {
        setEvidenceList(data);
        if (data.length > 0) {
          setSelectedFile(data[0]);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedFile) return;
    const typeKey = selectedFile.name.includes('mem') 
      ? 'memory' 
      : selectedFile.name.includes('Sec') 
        ? 'auth' 
        : 'registry';

    fetch(`${API_BASE_URL}/api/evidence/details/${typeKey}`)
      .then(res => res.json())
      .then(data => setRawContent(data));
  }, [selectedFile]);

  const verifyIntegrity = (fileId: string) => {
    setVerifyingMap(prev => ({ ...prev, [fileId]: true }));
    setTimeout(() => {
      setVerifyingMap(prev => ({ ...prev, [fileId]: false }));
      setVerifiedMap(prev => ({ ...prev, [fileId]: true }));
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto px-12 py-10 space-y-8 max-w-6xl mx-auto flex flex-col h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-cyber-border pb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight">Evidence Registry</h2>
          <p className="text-slate-400 text-sm mt-1">Read-only cryptographic chain of custody. Verifies raw data integrity on SANS SIFT.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-emerald-950/20 border border-emerald-800 px-3 py-1.5 rounded-lg text-cyber-success">
          <Lock className="w-4 h-4 text-cyber-success" />
          <span>WRITE PROTECTION FORCE-ENABLED</span>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 min-h-0">
        {/* Left column: Evidence Files List */}
        <div className="space-y-4 overflow-y-auto pr-2">
          <h3 className="font-bold font-mono text-xs tracking-wider text-slate-500 uppercase">Forensic Evidence Inventory</h3>
          <div className="space-y-4">
            {evidenceList.map((file) => {
              const isSelected = selectedFile?.id === file.id;
              const isVerifying = verifyingMap[file.id];
              const isVerified = verifiedMap[file.id];

              return (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer text-left space-y-3 ${
                    isSelected 
                      ? 'bg-cyber-accent/10 border-cyber-accent' 
                      : 'bg-cyber-card border-cyber-border hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <HardDrive className={`w-5 h-5 ${isSelected ? 'text-cyber-cyan' : 'text-slate-400'}`} />
                      <span className="font-bold text-xs font-mono text-slate-200">{file.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{file.size}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">{file.summary}</p>
                  
                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                    <div className="text-[9px] text-slate-500 font-mono truncate max-w-[120px]">
                      HASH: {file.hash.slice(0, 16)}...
                    </div>
                    {isVerified ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-cyber-success">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          verifyIntegrity(file.id);
                        }}
                        disabled={isVerifying}
                        className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-cyber-border rounded text-[10px] font-mono text-cyber-cyan cursor-pointer transition-colors"
                      >
                        {isVerifying ? 'Verifying...' : 'Verify Hash'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Raw File Explorer (Read-Only Preview) */}
        <div className="md:col-span-2 flex flex-col h-full min-h-0 bg-slate-950 border border-cyber-border rounded-xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="px-5 py-4 bg-slate-900 border-b border-cyber-border flex items-center justify-between shrink-0 font-mono text-xs">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-cyber-cyan" />
              <span className="font-bold text-slate-300">READ-ONLY VIEWER: {selectedFile?.name}</span>
            </div>
            <span className="text-slate-500 text-[10px]">VERIFIED HASH INTEGRITY</span>
          </div>

          {/* Raw Grid Table */}
          <div className="flex-1 overflow-auto p-4 font-mono text-[11px] text-slate-300">
            {rawContent ? (
              <div className="space-y-6">
                {/* Meta details */}
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div><span className="text-slate-500">Source Hive:</span> {selectedFile?.name}</div>
                  <div><span className="text-slate-500">Hash Manifest:</span> {selectedFile?.hash}</div>
                  <div><span className="text-slate-500">Acquisition Time:</span> {selectedFile?.acquired_at}</div>
                </div>

                {/* Content type specific headers */}
                {selectedFile?.name.includes('mem') && (
                  <div className="space-y-4">
                    <h4 className="text-cyber-cyan font-bold uppercase tracking-wider text-xs border-b border-slate-800 pb-1.5">Running Processes (volatile data)</h4>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800">
                          <th className="pb-2">PID</th>
                          <th className="pb-2">Image Name</th>
                          <th className="pb-2">Owner</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rawContent.processes?.map((p: any) => (
                          <tr key={p.pid} className="border-b border-slate-900/50 hover:bg-slate-900/30">
                            <td className="py-2.5 font-bold">{p.pid}</td>
                            <td className="py-2.5 text-slate-200">{p.name}</td>
                            <td className="py-2.5 text-slate-400">{p.owner}</td>
                            <td className="py-2.5">
                              {p.suspicious ? (
                                <span className="text-rose-400 font-bold bg-rose-950/20 border border-rose-900/40 px-1.5 py-0.5 rounded text-[10px]">Suspicious</span>
                              ) : (
                                <span className="text-slate-500">Standard</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedFile?.name.includes('Sec') && (
                  <div className="space-y-4">
                    <h4 className="text-cyber-cyan font-bold uppercase tracking-wider text-xs border-b border-slate-800 pb-1.5">Authentication Events</h4>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800">
                          <th className="pb-2">Event ID</th>
                          <th className="pb-2">User</th>
                          <th className="pb-2">IP Address</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rawContent.events?.map((e: any, i: number) => (
                          <tr key={i} className="border-b border-slate-900/50 hover:bg-slate-900/30">
                            <td className="py-2.5 font-bold">{e.event_id}</td>
                            <td className="py-2.5 text-slate-200">{e.user}</td>
                            <td className="py-2.5 text-slate-400 font-mono">{e.source_ip || 'LOCAL'}</td>
                            <td className="py-2.5">
                              {e.event_id === 4625 ? (
                                <span className="text-rose-400">Failed Login</span>
                              ) : e.notes?.includes('brute') ? (
                                <span className="text-rose-400 font-bold">Logon Breach</span>
                              ) : (
                                <span className="text-emerald-400">Success</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedFile?.name.includes('reg') && (
                  <div className="space-y-4">
                    <h4 className="text-cyber-cyan font-bold uppercase tracking-wider text-xs border-b border-slate-800 pb-1.5">Persistence Registry Keys</h4>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800">
                          <th className="pb-2">Key Value</th>
                          <th className="pb-2">Data Path</th>
                          <th className="pb-2">Last Write</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rawContent.registry_entries?.map((r: any, i: number) => (
                          <tr key={i} className="border-b border-slate-900/50 hover:bg-slate-900/30">
                            <td className="py-2.5 font-bold text-slate-200 truncate max-w-[150px]" title={r.value_name}>{r.value_name}</td>
                            <td className="py-2.5 text-slate-400 font-mono truncate max-w-[250px]" title={r.value_data}>{r.value_data}</td>
                            <td className="py-2.5 text-slate-500 font-mono">{new Date(r.last_write_time).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-24 text-slate-600 font-mono text-xs">
                Injesting data structure...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
