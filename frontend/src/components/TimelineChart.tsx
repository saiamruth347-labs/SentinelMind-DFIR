import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const TimelineChart: React.FC = () => {
  const data = [
    { time: '23:28', bruteForce: 0, c2Activity: 0, serviceInstall: 0 },
    { time: '23:29', bruteForce: 5, c2Activity: 0, serviceInstall: 0 },
    { time: '23:30', bruteForce: 18, c2Activity: 0, serviceInstall: 0 },
    { time: '23:31', bruteForce: 2, c2Activity: 0, serviceInstall: 0 }, // Login success here
    { time: '23:32', bruteForce: 0, c2Activity: 0, serviceInstall: 0 },
    { time: '23:33', bruteForce: 0, c2Activity: 0, serviceInstall: 0 },
    { time: '23:34', bruteForce: 0, c2Activity: 0, serviceInstall: 1 }, // Service installed
    { time: '23:35', bruteForce: 0, c2Activity: 8, serviceInstall: 0 }, // C2 activity starts
    { time: '23:36', bruteForce: 0, c2Activity: 24, serviceInstall: 0 },
    { time: '23:37', bruteForce: 0, c2Activity: 45, serviceInstall: 0 },
    { time: '23:38', bruteForce: 0, c2Activity: 52, serviceInstall: 0 },
    { time: '23:39', bruteForce: 0, c2Activity: 48, serviceInstall: 0 },
    { time: '23:40', bruteForce: 0, c2Activity: 50, serviceInstall: 0 },
  ];

  return (
    <div className="h-[250px] w-full bg-cyber-card border border-cyber-border rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4 font-mono text-[11px] text-slate-400">
        <span>INCIDENT TELEMETRY ANALYSIS (EVENTS / MINUTE)</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded"></span>Brute Force Attempts</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-cyber-accent rounded"></span>C2 Communications</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBrute" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorC2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
          <YAxis stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', fontSize: '11px', fontFamily: 'monospace' }} 
          />
          <Area type="monotone" dataKey="bruteForce" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBrute)" name="Brute Force Attempts" />
          <Area type="monotone" dataKey="c2Activity" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorC2)" name="C2 Requests" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
