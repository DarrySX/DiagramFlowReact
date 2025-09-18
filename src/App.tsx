import React, { useState, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FlowchartCanvas } from './components/FlowchartCanvas';
import { Toolbar } from './components/Toolbar';
import { FlowchartNodeData } from './components/FlowchartNode';
import { Connection } from './components/Connection';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './components/ui/alert-dialog';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [nodes, setNodes] = useState<FlowchartNodeData[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectionMode, setConnectionMode] = useState<{
    active: boolean;
    fromNode: string | null;
  }>({ active: false, fromNode: null });
  const canvasRef = useRef<HTMLDivElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addNode = useCallback((type: 'start' | 'process' | 'decision' | 'input' | 'end') => {
    const defaultTexts = {
      start: 'Inicio',
      process: 'Proceso',
      decision: '¿Decisión?',
      input: 'Entrada',
      end: 'Fin'
    };

    const newNode: FlowchartNodeData = {
      id: generateId(),
      type,
      text: defaultTexts[type],
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
    };

    setNodes(prev => [...prev, newNode]);
    toast.success(`Nodo ${defaultTexts[type]} agregado`);
  }, []);

  const updateNodeText = useCallback((id: string, text: string) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, text } : node
    ));
  }, []);

  const deleteNode = useCallback((id: string) => {
    setNodes(prev => prev.filter(node => node.id !== id));
    setConnections(prev => prev.filter(conn => conn.from !== id && conn.to !== id));
    if (selectedNodeId === id) {
      setSelectedNodeId(null);
    }
    toast.success('Nodo eliminado');
  }, [selectedNodeId]);

  const updateNodePosition = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, x, y } : node
    ));
  }, []);

  const selectNode = useCallback((id: string | null) => {
    if (connectionMode.active && id) {
      if (!connectionMode.fromNode) {
        // First node selected for connection
        setConnectionMode({ active: true, fromNode: id });
        setSelectedNodeId(id);
        toast.info('Selecciona el segundo nodo para conectar');
      } else if (connectionMode.fromNode !== id) {
        // Second node selected, create connection
        const newConnection: Connection = {
          id: generateId(),
          from: connectionMode.fromNode,
          to: id,
        };
        
        // Check if connection already exists
        const connectionExists = connections.some(
          conn => conn.from === connectionMode.fromNode && conn.to === id
        );
        
        if (!connectionExists) {
          setConnections(prev => [...prev, newConnection]);
          toast.success('Conexión creada');
        } else {
          toast.error('Ya existe una conexión entre estos nodos');
        }
        
        setConnectionMode({ active: false, fromNode: null });
        setSelectedNodeId(null);
      } else {
        // Same node selected, cancel connection
        setConnectionMode({ active: false, fromNode: null });
        setSelectedNodeId(null);
        toast.info('Conexión cancelada');
      }
    } else {
      setSelectedNodeId(id);
    }
  }, [connectionMode, connections]);

  const startConnection = useCallback(() => {
    if (nodes.length < 2) {
      toast.error('Necesitas al menos 2 nodos para crear una conexión');
      return;
    }
    setConnectionMode({ active: true, fromNode: null });
    toast.info('Modo conexión activado. Selecciona el primer nodo');
  }, [nodes.length]);

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setConnections([]);
    setSelectedNodeId(null);
    setConnectionMode({ active: false, fromNode: null });
    toast.success('Canvas limpiado');
  }, []);

  const exportToPNG = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      // Simple implementation - in a real app you'd use html2canvas or similar
      toast.info('Función de exportación disponible con html2canvas library');
    } catch (error) {
      toast.error('Error al exportar');
    }
  }, []);

  const printDiagram = useCallback(() => {
    window.print();
    toast.info('Abriendo diálogo de impresión');
  }, []);

  const saveDiagram = useCallback(() => {
    const diagramData = {
      nodes,
      connections,
      timestamp: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(diagramData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `diagrama-flujo-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Diagrama guardado');
  }, [nodes, connections]);

  const canConnect = nodes.length >= 2;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex bg-gray-100">
        {/* Sidebar */}
        <div className="w-80 p-4 bg-white shadow-lg overflow-y-auto">
          <div className="mb-6">
            <h1 className="mb-2">Creador de Diagramas de Flujo</h1>
            <p className="text-muted-foreground">
              Crea diagramas profesionales para presentaciones gerenciales
            </p>
          </div>
          
          <Toolbar
            onAddNode={addNode}
            onAddConnection={startConnection}
            onExport={exportToPNG}
            onPrint={printDiagram}
            onClear={clearCanvas}
            onSave={saveDiagram}
            canConnect={canConnect}
          />

          {connectionMode.active && (
            <Card className="mt-4 p-3 bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-700">
                {connectionMode.fromNode 
                  ? 'Selecciona el nodo de destino' 
                  : 'Selecciona el nodo de origen'
                }
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setConnectionMode({ active: false, fromNode: null });
                  setSelectedNodeId(null);
                  toast.info('Modo conexión desactivado');
                }}
                className="mt-2 w-full"
              >
                Cancelar Conexión
              </Button>
            </Card>
          )}

          {nodes.length === 0 && (
            <Card className="mt-4 p-4 bg-gray-50">
              <h3 className="mb-2">¡Comienza aquí!</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Agrega tu primer nodo para empezar a crear el diagrama de flujo.
              </p>
              <Button 
                onClick={() => addNode('start')} 
                size="sm"
                className="w-full"
              >
                Agregar Nodo de Inicio
              </Button>
            </Card>
          )}
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b p-4 flex justify-between items-center">
            <div>
              <h2>Canvas del Diagrama</h2>
              <p className="text-sm text-muted-foreground">
                {nodes.length} nodos, {connections.length} conexiones
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveDiagram}>
                Guardar Diagrama
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 hover:text-red-700">
                    Limpiar Todo
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará todos los nodos y conexiones del diagrama.
                      Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={clearCanvas}>
                      Sí, limpiar todo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <div className="flex-1" ref={canvasRef}>
            <FlowchartCanvas
              nodes={nodes}
              connections={connections}
              selectedNodeId={selectedNodeId}
              onUpdateNodeText={updateNodeText}
              onDeleteNode={deleteNode}
              onUpdateNodePosition={updateNodePosition}
              onSelectNode={selectNode}
              onCanvasClick={() => {
                if (!connectionMode.active) {
                  setSelectedNodeId(null);
                }
              }}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}