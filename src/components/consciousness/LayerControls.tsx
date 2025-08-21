import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Brain, Sparkles, Waves } from 'lucide-react';
import type { LayerState } from '../CognitionStream';

interface LayerControlsProps {
  layers: LayerState;
  onToggleLayer: (layer: keyof LayerState) => void;
  isMobile?: boolean;
}

export const LayerControls = ({ layers, onToggleLayer, isMobile = false }: LayerControlsProps) => {
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
    <div className={`absolute z-10 ${isMobile ? 'top-4 left-4 right-4' : 'top-6 left-6'} space-y-4`}>
      {/* Title - Simplified for mobile */}
      {!isMobile && (
        <Card className="glass-panel p-4">
          <h1 className="text-xl font-bold text-foreground mb-2">
            Cognition Stream
          </h1>
          <p className="text-sm text-muted-foreground">
            Interactive 3D consciousness visualization
          </p>
        </Card>
      )}

      {/* Layer Controls - Mobile optimized */}
      <Card className={`glass-panel ${isMobile ? 'p-3' : 'p-4'} ${isMobile ? 'space-y-2' : 'space-y-3'}`}>
        <h2 className={`font-semibold text-foreground ${isMobile ? 'text-base mb-2' : 'text-lg mb-3'}`}>
          {isMobile ? 'Layers' : 'Consciousness Layers'}
        </h2>
        
        {isMobile ? (
          // Compact mobile layout with switches
          <div className="space-y-2">
            {controls.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-card/10">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3 h-3 ${color}`} />
                  <span className="text-xs font-medium text-foreground">{label}</span>
                </div>
                <Switch
                  checked={layers[key]}
                  onCheckedChange={() => onToggleLayer(key)}
                  className="scale-75"
                />
              </div>
            ))}
          </div>
        ) : (
          // Desktop layout
          controls.map(({ key, label, description, icon: Icon, color, gradient }) => (
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
          ))
        )}
      </Card>

      {/* Instructions - Hidden on mobile */}
      {!isMobile && (
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
      )}
    </div>
  );
};