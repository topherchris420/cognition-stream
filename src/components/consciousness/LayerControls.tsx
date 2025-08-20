import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Waves } from 'lucide-react';
import type { LayerState } from '../CognitionStream';

interface LayerControlsProps {
  layers: LayerState;
  onToggleLayer: (layer: keyof LayerState) => void;
}

export const LayerControls = ({ layers, onToggleLayer }: LayerControlsProps) => {
  const controls = [
    {
      key: 'higherMind' as keyof LayerState,
      label: 'Higher Mind',
      description: 'Ethereal energy field',
      icon: Sparkles,
      color: 'text-consciousness-higher-mind',
      gradient: 'from-consciousness-higher-glow to-consciousness-higher-mind'
    },
    {
      key: 'physicalBrain' as keyof LayerState,
      label: 'Physical Brain',
      description: 'Neural network activity',
      icon: Brain,
      color: 'text-consciousness-neural-pulse',
      gradient: 'from-consciousness-neural-pulse to-consciousness-neural-network'
    },
    {
      key: 'physicalMind' as keyof LayerState,
      label: 'Physical Mind',
      description: 'Perception patterns',
      icon: Waves,
      color: 'text-consciousness-physical-mind',
      gradient: 'from-consciousness-physical-mind to-consciousness-energy-flow'
    }
  ];

  return (
    <div className="absolute top-6 left-6 z-10 space-y-4">
      {/* Title */}
      <Card className="glass-panel p-4">
        <h1 className="text-xl font-bold text-foreground mb-2">
          Cognition Stream
        </h1>
        <p className="text-sm text-muted-foreground">
          Interactive 3D consciousness visualization
        </p>
      </Card>

      {/* Layer Controls */}
      <Card className="glass-panel p-4 space-y-3">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Consciousness Layers
        </h2>
        
        {controls.map(({ key, label, description, icon: Icon, color, gradient }) => (
          <div
            key={key}
            className="flex items-center justify-between p-3 rounded-lg bg-card/20 backdrop-blur-sm border border-border/30"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-gradient-to-br ${gradient} bg-opacity-20`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm">
                    {label}
                  </span>
                  {layers[key] && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 py-0 ethereal-glow"
                    >
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
            
            <Button
              variant={layers[key] ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleLayer(key)}
              className={`
                transition-all duration-300
                ${layers[key] 
                  ? `bg-gradient-to-r ${gradient} text-white shadow-lg` 
                  : 'hover:bg-secondary/80'
                }
              `}
            >
              {layers[key] ? 'Hide' : 'Show'}
            </Button>
          </div>
        ))}
      </Card>

      {/* Instructions */}
      <Card className="glass-panel p-4">
        <h3 className="text-sm font-medium text-foreground mb-2">
          Controls
        </h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Drag to rotate the view</li>
          <li>• Scroll to zoom in/out</li>
          <li>• Toggle layers to isolate effects</li>
        </ul>
      </Card>
    </div>
  );
};