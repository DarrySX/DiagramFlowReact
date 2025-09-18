import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { FlowchartNode, FlowchartNodeData } from './FlowchartNode';
import { Connection } from './Connection';

interface FlowchartCanvasProps {
  nodes: FlowchartNodeData[];
  connections: Connection[];
  selectedNodeId: string | null;
  onUpdateNodeText: (id: string, text: string) => void;
  onDeleteNode: (id: string) => void;
  onUpdateNodePosition: (id: string, x: number, y: number) => void;
  onSelectNode: (id: string | null) => void;
  onCanvasClick: () => void;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
}

export function FlowchartCanvas({
  nodes,
  connections,
  selectedNodeId,
  onUpdateNodeText,
  onDeleteNode,
  onUpdateNodePosition,
  onSelectNode,
  onCanvasClick
}: FlowchartCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'node',
    drop: (item: { id: string }, monitor) => {
      if (!canvasRef.current) return;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      
      if (clientOffset) {
        const x = clientOffset.x - canvasRect.left - 50; // Offset for node center
        const y = clientOffset.y - canvasRect.top - 30;
        
        return { x: Math.max(0, x), y: Math.max(0, y) };
      }
    },
  });

  const getNodeById = (id: string) => nodes.find(node => node.id === id);

  const renderConnections = () => {
    return connections.map(connection => {
      const fromNode = getNodeById(connection.from);
      const toNode = getNodeById(connection.to);
      
      if (!fromNode || !toNode) return null;

      const fromX = fromNode.x + 60; // Approximate node center
      const fromY = fromNode.y + 30;
      const toX = toNode.x + 60;
      const toY = toNode.y + 30;

      // Calculate arrow direction
      const dx = toX - fromX;
      const dy = toY - fromY;
      const angle = Math.atan2(dy, dx);
      
      // Arrow head points
      const arrowLength = 10;
      const arrowAngle = Math.PI / 6;
      
      const arrowX1 = toX - arrowLength * Math.cos(angle - arrowAngle);
      const arrowY1 = toY - arrowLength * Math.sin(angle - arrowAngle);
      const arrowX2 = toX - arrowLength * Math.cos(angle + arrowAngle);
      const arrowY2 = toY - arrowLength * Math.sin(angle + arrowAngle);

      return (
        <g key={connection.id}>
          <line
            x1={fromX}
            y1={fromY}
            x2={toX}
            y2={toY}
            stroke="#374151"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
          <polygon
            points={`${toX},${toY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
            fill="#374151"
          />
        </g>
      );
    });
  };

  return (
    <div
      ref={(el) => {
        canvasRef.current = el;
        drop(el);
      }}
      className="relative w-full h-full bg-gray-50 overflow-auto"
      onClick={onCanvasClick}
    >
      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
          </marker>
        </defs>
        {renderConnections()}
      </svg>

      {/* Nodes */}
      <div className="relative" style={{ zIndex: 2 }}>
        {nodes.map(node => (
          <FlowchartNode
            key={node.id}
            node={node}
            onUpdateText={onUpdateNodeText}
            onDelete={onDeleteNode}
            onUpdatePosition={onUpdateNodePosition}
            isSelected={selectedNodeId === node.id}
            onSelect={onSelectNode}
          />
        ))}
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          zIndex: 0
        }}
      />
    </div>
  );
}