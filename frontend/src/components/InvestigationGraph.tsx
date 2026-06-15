import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  Position
} from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

interface InvestigationGraphProps {
  logs: any[];
  status: string;
}

export const InvestigationGraph: React.FC<InvestigationGraphProps> = ({ logs, status }) => {
  // Find which agents are currently active or have run
  const executedAgents = useMemo(() => {
    return new Set(logs.map(log => log.agent_name));
  }, [logs]);

  const currentAgent = useMemo(() => {
    if (status !== 'Running' || logs.length === 0) return null;
    return logs[logs.length - 1].agent_name;
  }, [logs, status]);

  const isSelfCorrectionActive = useMemo(() => {
    return logs.some(log => log.is_self_correction === 1);
  }, [logs]);

  // Construct nodes
  const nodes: Node[] = useMemo(() => {
    const agentsList = [
      { id: 'collector', name: 'Evidence Collector Agent', x: 100, y: 150, desc: 'Mounts & extracts files' },
      { id: 'timeline', name: 'Timeline Analyst Agent', x: 350, y: 50, desc: 'Parses Event logs (evtx)' },
      { id: 'memory', name: 'Memory Analysis Agent', x: 350, y: 250, desc: 'Scans memdump & processes' },
      { id: 'correlation', name: 'Correlation Agent', x: 600, y: 150, desc: 'Cross-validates IOCs' },
      { id: 'skeptic', name: 'Skeptic Agent', x: 850, y: 150, desc: 'Challenges findings' },
      { id: 'reporter', name: 'Report Agent', x: 1100, y: 150, desc: 'Compiles PDF report' },
    ];

    return agentsList.map((agent) => {
      const isExecuted = executedAgents.has(agent.name);
      const isActive = currentAgent === agent.name;
      
      let borderClass = 'border-cyber-border';
      let bgClass = 'bg-cyber-card/80';
      let textClass = 'text-slate-400';
      
      if (isExecuted) {
        borderClass = 'border-cyber-accent/50';
        bgClass = 'bg-cyber-accent/10';
        textClass = 'text-slate-200';
      }
      
      if (isActive) {
        borderClass = 'border-cyber-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)]';
        bgClass = 'bg-cyber-cyan/15 animate-pulse';
        textClass = 'text-cyber-cyan font-bold';
      }

      if (agent.id === 'skeptic' && isSelfCorrectionActive) {
        borderClass = 'border-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
        bgClass = 'bg-rose-950/20';
        textClass = 'text-rose-400 font-bold';
      }

      return {
        id: agent.id,
        position: { x: agent.x, y: agent.y },
        data: {
          label: (
            <div className={`p-4 rounded-xl border ${borderClass} ${bgClass} text-left select-none max-w-xs transition-all duration-300`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-mono tracking-wide ${textClass}`}>{agent.name}</span>
                {isActive && (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-cyan"></span>
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-sans leading-normal">{agent.desc}</p>
            </div>
          )
        },
        style: { width: 220 },
      };
    });
  }, [executedAgents, currentAgent, isSelfCorrectionActive]);

  // Construct edges
  const edges: Edge[] = useMemo(() => {
    const isCollectorDone = executedAgents.has('Evidence Collector Agent');
    const isTimelineDone = executedAgents.has('Timeline Analyst Agent');
    const isMemoryDone = executedAgents.has('Memory Analysis Agent');
    const isCorrelationDone = executedAgents.has('Correlation Agent');
    const isSkepticDone = executedAgents.has('Skeptic Agent');
    
    return [
      {
        id: 'e1-2',
        source: 'collector',
        target: 'timeline',
        animated: isCollectorDone,
        style: { stroke: isCollectorDone ? '#0ea5e9' : '#1e293b' }
      },
      {
        id: 'e1-3',
        source: 'collector',
        target: 'memory',
        animated: isCollectorDone,
        style: { stroke: isCollectorDone ? '#0ea5e9' : '#1e293b' }
      },
      {
        id: 'e2-4',
        source: 'timeline',
        target: 'correlation',
        animated: isTimelineDone,
        style: { stroke: isTimelineDone ? '#0ea5e9' : '#1e293b' }
      },
      {
        id: 'e3-4',
        source: 'memory',
        target: 'correlation',
        animated: isMemoryDone,
        style: { stroke: isMemoryDone ? '#0ea5e9' : '#1e293b' }
      },
      {
        id: 'e4-5',
        source: 'correlation',
        target: 'skeptic',
        animated: isCorrelationDone,
        style: { stroke: isCorrelationDone ? '#0ea5e9' : '#1e293b' }
      },
      {
        id: 'e5-1',
        source: 'skeptic',
        target: 'collector',
        animated: isSelfCorrectionActive,
        label: isSelfCorrectionActive ? 'Self-Correction Loop' : '',
        labelStyle: { fill: '#f43f5e', fontSize: 10, fontFamily: 'monospace' },
        style: { 
          stroke: isSelfCorrectionActive ? '#f43f5e' : '#1e293b', 
          strokeDasharray: isSelfCorrectionActive ? '5' : '0'
        },
        type: 'smoothstep'
      },
      {
        id: 'e5-6',
        source: 'skeptic',
        target: 'reporter',
        animated: isSkepticDone && !isSelfCorrectionActive,
        style: { stroke: isSkepticDone && !isSelfCorrectionActive ? '#0ea5e9' : '#1e293b' }
      }
    ];
  }, [executedAgents, isSelfCorrectionActive]);

  return (
    <div className="h-[400px] w-full bg-slate-950/80 border border-cyber-border rounded-xl overflow-hidden relative shadow-inner">
      <div className="absolute top-4 left-4 z-10 font-mono text-[11px] text-slate-500 bg-slate-900/80 border border-cyber-border px-3 py-1.5 rounded-lg">
        INTERACTIVE AGENT WORKFLOW MAP
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesConnectable={false}
        nodesDraggable={true}
        zoomOnScroll={false}
        panOnScroll={false}
      >
        <Background color="#1e293b" gap={16} size={1} />
        <Controls showInteractive={false} className="bg-slate-900 border border-cyber-border text-slate-400 rounded" />
      </ReactFlow>
    </div>
  );
};
