import React, { useMemo, useCallback, useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap, addEdge, useEdgesState, useNodesState, Position, Handle, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { differenceInMinutes, parseISO, format } from 'date-fns';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { BundleMovementRecord } from '@/app/types/styles';
import { ProgressSpinner } from 'primereact/progressspinner';

// --- Custom node with PrimeReact Card -------------------------------------------
const NodeCard: React.FC<{ data: any }> = ({ data }) => {
  const { department, entryTime, exitTime, user, durationMin } = data;

  const header = (
    <div className="flex align-items-center gap-2">
      <i className="pi pi-building text-blue-500" />
      <span className="font-semibold text-sm">{department}</span>
    </div>
  );

  const footer = (
    <div className="flex justify-content-between align-items-center text-xs text-gray-600 gap-1">
      <div className="flex align-items-center gap-1">
        <Avatar label={user.charAt(0)} size="small" shape="circle" />
        <span>{user}</span>
      </div>
      <Tag severity="info" value={`${durationMin} min`} />
    </div>
  );

  return (
    <Card header={header} footer={footer} className="shadow-2 border-round-xl min-w-[220px]">
      <div className="text-[11px] leading-tight">
        <div>
          <i className="pi pi-sign-in mr-1 text-green-500" />
          {format(parseISO(entryTime), 'MMM d, HH:mm')}
        </div>
        <div>
          <i className="pi pi-sign-out mr-1 text-red-500" />
          {format(parseISO(exitTime), 'MMM d, HH:mm')}
        </div>
      </div>
      <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} />
    </Card>
  );
};

const nodeTypes = { card: NodeCard } as const;

// --- Layout utils (Dagre Left->Right) -------------------------------------------
const nodeWidth = 260;
const nodeHeight = 150;

function layoutLR(nodes: Node[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR', nodesep: 48, ranksep: 96, marginx: 24, marginy: 24 });

  nodes.forEach((n) => g.setNode(n.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  const laidOutNodes = nodes.map((n) => {
    const { x, y } = g.node(n.id);
    return { ...n, position: { x: x - nodeWidth / 2, y: y - nodeHeight / 2 } };
  });
  return { nodes: laidOutNodes, edges };
}

// --- Transform records to React Flow graph --------------------------------------
function buildGraph(records: BundleMovementRecord[]) {
  const sorted = [...records].sort((a, b) => parseISO(a.entryTime).getTime() - parseISO(b.entryTime).getTime());

  const nodes: Node[] = sorted.map((r, idx) => {
    const durationMin = Math.max(0, differenceInMinutes(parseISO(r.exitTime), parseISO(r.entryTime)));
    return {
      id: r.id,
      type: 'card',
      data: { ...r, durationMin },
      position: { x: idx * (nodeWidth + 80), y: 0 }
    } as Node;
  });

  const edges: Edge[] = sorted.slice(1).map((r, i) => {
    const prev = sorted[i];
    const gapMin = Math.max(0, differenceInMinutes(parseISO(r.entryTime), parseISO(prev.exitTime)));
    return {
      id: `${prev.id}->${r.id}`,
      source: prev.id,
      target: r.id,
      type: 'smoothstep',
      label: gapMin ? `${gapMin} min gap` : undefined,
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 6,
      animated: gapMin > 60
    } as Edge;
  });

  return layoutLR(nodes, edges);
}

export default function BundleEntryFlow({ records = [], loading }: { records?: BundleMovementRecord[], loading?: boolean }) {
  const build = useCallback(() => buildGraph(records), [records]);

  // seed once (safe default)
  const seeded = useMemo(build, [build]);
  const hasRecords = records.length > 0;

  const [nodes, setNodes, onNodesChange] = useNodesState(seeded.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(seeded.edges);

  // whenever records change → rebuild graph + replace state
  useEffect(() => {
    const g = build();
    setNodes(g.nodes);
    setEdges(g.edges);
  }, [build, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '70vh' }}>
      {loading &&
        <div className="col-12 flex justify-content-center align-items-center">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
        </div>
      }
        {hasRecords ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <MiniMap pannable zoomable />
          <Controls />
          <Background gap={12} />
        </ReactFlow>
      ) : (
        <div className="flex flex-column align-items-center justify-content-center h-full w-full text-gray-500">
          <i className="pi pi-search text-4xl mb-3" />
          <span className="text-lg font-medium">Please search a bundle to get started.</span>
        </div>
      )}
    </div>
  );
}

