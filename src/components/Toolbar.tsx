import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { 
  Circle, 
  Square, 
  Diamond, 
  Hexagon, 
  ArrowRight, 
  Download, 
  Printer,
  Trash2,
  Save
} from 'lucide-react';

interface ToolbarProps {
  onAddNode: (type: 'start' | 'process' | 'decision' | 'input' | 'end') => void;
  onAddConnection: () => void;
  onExport: () => void;
  onPrint: () => void;
  onClear: () => void;
  onSave: () => void;
  canConnect: boolean;
}

export function Toolbar({ 
  onAddNode, 
  onAddConnection, 
  onExport, 
  onPrint, 
  onClear, 
  onSave,
  canConnect 
}: ToolbarProps) {
  return (
    <Card className="p-4 bg-white shadow-lg">
      <div className="space-y-4">
        <div>
          <h3 className="mb-2">Agregar Nodos</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddNode('start')}
              className="flex items-center gap-2"
            >
              <Circle className="w-4 h-4 text-green-600" />
              Inicio
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddNode('process')}
              className="flex items-center gap-2"
            >
              <Square className="w-4 h-4 text-blue-600" />
              Proceso
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddNode('decision')}
              className="flex items-center gap-2"
            >
              <Diamond className="w-4 h-4 text-yellow-600" />
              Decisión
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddNode('input')}
              className="flex items-center gap-2"
            >
              <Hexagon className="w-4 h-4 text-purple-600" />
              Entrada
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddNode('end')}
              className="flex items-center gap-2 col-span-2"
            >
              <Circle className="w-4 h-4 text-red-600" />
              Fin
            </Button>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="mb-2">Conexiones</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddConnection}
            disabled={!canConnect}
            className="w-full flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            Conectar Nodos
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            Selecciona dos nodos para conectar
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="mb-2">Acciones</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              className="w-full flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="w-full flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar PNG
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onPrint}
              className="w-full flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="w-full flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Limpiar Todo
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}