import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Evidence } from './pages/Evidence';
import { Activity } from './pages/Activity';
import { Correction } from './pages/Correction';
import { Report } from './pages/Report';
import { Audit } from './pages/Audit';
import { Terminal, Shield, RefreshCw } from 'lucide-react';

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://127.0.0.1:8000' 
  : 'https://sentinelmind-dfir.onrender.com';

export default function App() {
  const [activePage, setActivePage] = useState<string>('landing');
  const [investigationId, setInvestigationId] = useState<string | null>(null);
  const [targetHost, setTargetHost] = useState<string>('WS-DFIR-STAGE01');
  const [status, setStatus] = useState<string>('Pending');
  const [logs, setLogs] = useState<any[]>([]);
  const [findings, setFindings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Poll investigation state once active
  useEffect(() => {
    if (!investigationId) return;

    const interval = setInterval(() => {
      // Fetch Status
      fetch(`${API_BASE_URL}/api/investigation/${investigationId}/status`)
        .then(res => res.json())
        .then(data => {
          setStatus(data.status);
          if (data.status === 'Completed') {
            clearInterval(interval);
          }
        })
        .catch(err => console.error("Error fetching status:", err));

      // Fetch Logs
      fetch(`${API_BASE_URL}/api/investigation/${investigationId}/logs`)
        .then(res => res.json())
        .then(data => setLogs(data))
        .catch(err => console.error("Error fetching logs:", err));

      // Fetch Findings
      fetch(`${API_BASE_URL}/api/investigation/${investigationId}/findings`)
        .then(res => res.json())
        .then(data => setFindings(data))
        .catch(err => console.error("Error fetching findings:", err));
    }, 2000);

    return () => clearInterval(interval);
  }, [investigationId]);

  const handleStartInvestigation = (host: string) => {
    setIsLoading(true);
    setTargetHost(host);
    
    fetch(`${API_BASE_URL}/api/investigation/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target_host: host }),
    })
      .then(res => res.json())
      .then(data => {
        setInvestigationId(data.investigation_id);
        setStatus(data.status);
        setLogs([]);
        setFindings([]);
        setIsLoading(false);
        setActivePage('dashboard');
      })
      .catch(err => {
        console.error("Error starting investigation:", err);
        setIsLoading(false);
      });
  };

  const renderContent = () => {
    switch (activePage) {
      case 'landing':
        return <Landing onStartInvestigation={handleStartInvestigation} isLoading={isLoading} />;
      case 'dashboard':
        return (
          <Dashboard 
            logs={logs} 
            findings={findings} 
            status={status} 
            targetHost={targetHost} 
            setActivePage={setActivePage} 
          />
        );
      case 'evidence':
        return <Evidence />;
      case 'activity':
        return <Activity logs={logs} status={status} />;
      case 'correction':
        return <Correction logs={logs} />;
      case 'report':
        return <Report investigationId={investigationId} />;
      case 'audit':
        return <Audit logs={logs} />;
      default:
        return <Landing onStartInvestigation={handleStartInvestigation} isLoading={isLoading} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-cyber-dark overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        investigationId={investigationId} 
      />

      {/* Main Page Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-cyber-dark to-slate-950">
        {/* Top Mini-status Header Bar */}
        <header className="h-14 bg-cyber-card/30 border-b border-cyber-border/40 px-6 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
            <span>PLATFORM: ACTIVE</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyber-cyan animate-pulse"></span>
          </div>
          
          {investigationId && (
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>SHELL: <span className="text-slate-300">STAGE01</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>COBALT SEARCH: <span className={status === 'Completed' ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                  {status === 'Completed' ? 'CRITICAL BREACH' : 'EVALUATING'}
                </span></span>
              </div>
            </div>
          )}
        </header>

        {/* Dynamic Page Rendering */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
