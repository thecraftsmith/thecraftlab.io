// src/components/DataLineage.jsx
import '@reactflow/core/dist/style.css';
import '@reactflow/core/dist/base.css';
import '@reactflow/controls/dist/style.css';

import React, { useEffect, useState, useRef } from 'react';
import { ReactFlow, Position } from '@reactflow/core';
import { Controls } from '@reactflow/controls';
import { Background } from '@reactflow/background';
import { motion } from 'framer-motion';

import lineageData from '../data/data_lineage_graph.json';

// ————————————————————————————————————————————————————————————————
// CONFIGURAÇÕES FIXAS DO LAYOUT
// ————————————————————————————————————————————————————————————————
const nodeWidth    = 300;  // largura de cada nó (tabela)
const nodeHeight   = 50;   // altura de cada nó
const innerPad     = 16;   // padding interno entre nó e grupo (e gap vertical)
const xGap         = 500;  // espaçamento horizontal bruto entre estágios
const groupPadding = 20;   // padding externo em volta de cada caixa de estágio (reduzido)

// yGap = distância vertical real entre o topo de um nó e o topo do próximo.
// Como nodeHeight já é 50px, somamos innerPad para ter 16px de gap vertical real.
const yGap = nodeHeight + innerPad; // 50 + 16 = 66px

const groupStages = ['Raw', 'Cleaned', 'Product', 'Analytics'];

// Tipo de nó customizado apenas para imprimir o label do grupo (ex: “RAW”, “CLEANED”)
const nodeTypes = {
  groupNode: ({ data }) => (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute top-2 left-4 text-sm text-lime-400 font-bold tracking-widest uppercase"
    >
      {data.label}
    </motion.div>
  ),
};

export default function DataLineage() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 50, y: 50 });

  const popupRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const stageMap = {};
    groupStages.forEach((stage, idx) => {
      stageMap[stage] = { x: idx * xGap, count: 0, ids: [] };
    });

    const tableNodes = lineageData.nodes.map((nodeObj) => {
      const { id, table, database, stage } = nodeObj;
      const idx = stageMap[stage].count;
      const x   = stageMap[stage].x;
      const y   = idx * yGap + innerPad;
      stageMap[stage].count += 1;
      stageMap[stage].ids.push({ id, x, y });
      return {
        id,
        data: { label: `${database}: ${table}` },
        position: { x, y },
        style: {
          width: nodeWidth,
          height: nodeHeight,
          border: '1px solid #50fa7b',
          borderRadius: 4,
          background: '#3b3f5c',
          color: '#f8f8f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          fontWeight: 'bold',
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: false,
      };
    });

    const groupNodes = [];
    groupStages.forEach((stage) => {
      const { x: stageX, count } = stageMap[stage];
      const stageY = -groupPadding;
      const stageHeight = count * (nodeHeight + innerPad) + innerPad * 2;
      const stageWidth = nodeWidth + groupPadding * 2;
      groupNodes.push({
        id: `group-${stage.toLowerCase()}`,
        type: 'groupNode',
        data: { label: stage },
        position: { x: stageX - groupPadding, y: stageY },
        style: {
          width: stageWidth,
          height: stageHeight,
          border: '2px solid #6272a4',
          borderRadius: 8,
          background: 'rgba(98,114,164,0.05)',
        },
        draggable: false,
        selectable: false,
      });
    });

    setNodes([...groupNodes, ...tableNodes]);
    const flowEdges = lineageData.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'straight',
      style: { stroke: '#888', strokeWidth: 1.5, cursor: 'pointer' },
      markerEnd: { type: 'arrowclosed', color: '#888' },
    }));
    setEdges(flowEdges);
  }, []);

  const handleNodeClick = (_, node) => {
    if (node.id.startsWith('group-')) return;
    const metadata = lineageData.nodes.find((n) => n.id === node.id);
    if (metadata) {
      setSelectedNode(metadata);
      setIsPopupVisible(true);
      setIsMinimized(false);
    }
  };

  const onMouseDown = (e) => {
    const rect = popupRef.current.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    setPopupPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
  };

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  const handleClose = () => setIsPopupVisible(false);
  const handleMinimize = () => setIsMinimized((prev) => !prev);

  return (
    <div className="w-full h-full flex flex-col">
      <div style={{ width: '100%', height: '80vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          defaultEdgeOptions={{ type: 'straight' }}
          onNodeClick={handleNodeClick}
        >
          <Controls />
          <Background gap={24} size={1} color="#444" />
        </ReactFlow>
      </div>

      {isPopupVisible && selectedNode && (
        <div
          ref={popupRef}
          style={{
            position: 'absolute',
            top: popupPos.y,
            left: popupPos.x,
            // largura automática conforme conteúdo, mínimo de 200px quando minimizado
            width: isMinimized ? '200px' : 'auto',
            padding: '12px',
            background: '#1c1e26',
            border: '1px solid #6272a4',
            borderRadius: '8px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            color: '#f8f8f2',
            maxWidth: '400px', // para não extrapolar a viewport
          }}
        >
          <div
            className="flex justify-between items-center cursor-move"
            style={{ background: '#282a36', padding: '8px 12px', borderRadius: '8px 8px 0 0', whiteSpace: 'nowrap' }}
            onMouseDown={onMouseDown}
          >
            <span className="font-bold">{selectedNode.label} Details</span>
            <div className="flex space-x-2">
              <button onClick={handleMinimize} className="px-1">_</button>
              <button onClick={handleClose} className="px-1">×</button>
            </div>
          </div>

          {!isMinimized && (
            <div className="mt-2">
              <p className="text-sm text-lime-400 mb-1">Stage: {selectedNode.stage}</p>
              <p className="text-sm mb-2">Database: {selectedNode.database}</p>
              <div>
                <h3 className="font-bold text-lime-300">Sources:</h3>
                <ul className="list-disc list-inside ml-4">
                  {selectedNode.sources.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <h3 className="font-bold text-lime-300">Fields:</h3>
                <ul className="list-disc list-inside ml-4">
                  {selectedNode.fields.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}