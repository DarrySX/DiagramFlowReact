import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Trash2, Edit3 } from 'lucide-react';
import { Button } from './ui/button';

export interface FlowchartNodeData {
  id: string;
  type: 'start' | 'process' | 'decision' | 'input' | 'end';
  text: string;
  x: number;
  y: number;
}

interface FlowchartNodeProps {
  node: FlowchartNodeData;
  onUpdateText: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function FlowchartNode({ 
  node, 
  onUpdateText, 
  onDelete, 
  onUpdatePosition,
  isSelected,
  onSelect
}: FlowchartNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(node.text);

  const [{ isDragging }, drag] = useDrag({
    type: 'node',
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult && dropResult.x !== undefined && dropResult.y !== undefined) {
        onUpdatePosition(node.id, dropResult.x, dropResult.y);
      }
    },
  });

  const handleSaveText = () => {
    onUpdateText(node.id, editText);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveText();
    }
    if (e.key === 'Escape') {
      setEditText(node.text);
      setIsEditing(false);
    }
  };

  const getNodeStyle = () => {
    const baseStyle = "min-w-32 min-h-16 flex items-center justify-center p-3 cursor-move relative group";
    const selectedStyle = isSelected ? "ring-2 ring-primary" : "";
    
    switch (node.type) {
      case 'start':
      case 'end':
        return `${baseStyle} ${selectedStyle} rounded-full bg-green-100 border-2 border-green-500 text-green-800`;
      case 'process':
        return `${baseStyle} ${selectedStyle} rounded-lg bg-blue-100 border-2 border-blue-500 text-blue-800`;
      case 'decision':
        return `${baseStyle} ${selectedStyle} bg-yellow-100 border-2 border-yellow-500 text-yellow-800 transform rotate-45`;
      case 'input':
        return `${baseStyle} ${selectedStyle} bg-purple-100 border-2 border-purple-500 text-purple-800 rounded-lg border-l-8`;
      default:
        return `${baseStyle} ${selectedStyle} rounded-lg bg-gray-100 border-2 border-gray-500`;
    }
  };

  const getNodeShape = () => {
    if (node.type === 'decision') {
      return (
        <div className={getNodeStyle()}>
          <div className="transform -rotate-45 text-center text-sm">
            {isEditing ? (
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleSaveText}
                onKeyDown={handleKeyPress}
                className="w-20 h-8 text-xs text-center bg-transparent border-none p-0"
                autoFocus
              />
            ) : (
              <span className="break-words">{node.text}</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={getNodeStyle()}>
        <div className="text-center text-sm">
          {isEditing ? (
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSaveText}
              onKeyDown={handleKeyPress}
              className="w-24 h-8 text-xs text-center bg-transparent border-none p-0"
              autoFocus
            />
          ) : (
            <span className="break-words">{node.text}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={drag}
      className={`absolute ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{ left: node.x, top: node.y }}
      onClick={() => onSelect(node.id)}
    >
      {getNodeShape()}
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="w-6 h-6 p-0"
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            className="w-6 h-6 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}