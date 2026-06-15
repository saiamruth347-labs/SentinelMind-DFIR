import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  FileSearch, 
  Terminal, 
  RefreshCw, 
  FileText, 
  History, 
  Home 
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  investigationId: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, investigationId }) => {
  const menuItems = [
    { id: 'landing', label: 'Home', icon: Home, requiresInv: false },
    { id: 'dashboard', label: 'Ops Dashboard', icon: LayoutDashboard, requiresInv: true },
    { id: 'evidence', label: 'Evidence Explorer', icon: FileSearch, requiresInv: true },
    { id: 'activity', label: 'Agent Monitor', icon: Terminal, requiresInv: true },
    { id: 'correction', label: 'Self-Correction', icon: RefreshCw, requiresInv: true },
    { id: 'report', label: 'Incident Report', icon: FileText, requiresInv: true },
    { id: 'audit', label: 'Audit Trail', icon: History, requiresInv: true },
  ];

  return (
    <aside className="w-64 bg-cyber-card border-r border-cyber-border h-screen flex flex-col justify-between select-none">
      <div>
        {/* Logo Section */}
        <div className="p-6 border-b border-cyber-border flex items-center gap-3">
          <Shield className="w-8 h-8 text-cyber-accent animate-pulse" />
          <div>
            <h1 className="font-extrabold text-lg tracking-wider text-glow-cyber text-cyber-cyan">SENTINELMIND</h1>
            <span className="text-xs text-slate-500 uppercase tracking-widest font-mono">DFIR platform</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isDisabled = item.requiresInv && !investigationId;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                disabled={isDisabled}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDisabled 
                    ? 'text-slate-600 cursor-not-allowed opacity-40' 
                    : isActive 
                      ? 'bg-cyber-accent/15 border-l-4 border-cyber-accent text-cyber-cyan shadow-md shadow-cyber-accent/5' 
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyber-cyan' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isDisabled && (
                  <span className="ml-auto text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-700">
                    Locked
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Target Status Banner */}
      <div className="p-4 border-t border-cyber-border bg-cyber-dark/40">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
          <span>INVESTIGATION STATUS</span>
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${investigationId ? 'bg-cyber-success' : 'bg-slate-600'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${investigationId ? 'bg-cyber-success' : 'bg-slate-600'}`}></span>
          </span>
        </div>
        <div className="bg-cyber-dark p-3 rounded-lg border border-cyber-border font-mono">
          <div className="text-[11px] text-slate-400 truncate">
            ID: <span className="text-cyber-cyan">{investigationId || 'NO ACTIVE SESSION'}</span>
          </div>
          {investigationId && (
            <div className="text-[10px] text-slate-500 mt-1">
              Host: <span className="text-slate-300">WS-DFIR-STAGE01</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
