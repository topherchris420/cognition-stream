import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Brain, Sparkles, Waves, Info } from 'lucide-react';
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
    <div className={`absolute z-10 ${isMobile ? 'top-4 left-4 right-4' : 'top-8 left-8'} space-y-3`}>
      {/* Modern Header - Minimalist */}
      {!isMobile && (
        <Card className="glass-panel p-6 border-l-2 border-l-primary">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-display font-semibold text-foreground tracking-tight">
                Cognition Stream
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-light">
                Real-time consciousness visualization experiment
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent/10 border border-accent/20">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-accent uppercase tracking-wider">Live</span>
            </div>
          </div>
        </Card>
      )}

      {/* Modern Layer Controls */}
      <Card className={`glass-panel ${isMobile ? 'p-3' : 'p-5'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-display font-medium text-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
            {isMobile ? 'Layers' : 'Visualization Layers'}
          </h2>
          {!isMobile && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Info className="w-3 h-3" />
              <span>{Object.values(layers).filter(Boolean).length}/3 active</span>
            </div>
          )}
        </div>
        
        {isMobile ? (
          // Mobile: Compact switches
          <div className="space-y-2">
            {controls.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${color.replace('text-', 'bg-')}/10`}>
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                  <span className="text-xs font-medium text-foreground">{label}</span>
                </div>
                <Switch
                  checked={layers[key]}
                  onCheckedChange={() => onToggleLayer(key)}
                  className="scale-90"
                />
              </div>
            ))}
          </div>
        ) : (
          // Desktop: Modern minimal design
          <div className="space-y-2">
            {controls.map(({ key, label, description, icon: Icon, color }) => (
              <div
                key={key}
                className={`
                  group relative overflow-hidden rounded-lg border transition-all duration-200
                  ${layers[key] 
                    ? 'bg-card/80 border-border' 
                    : 'bg-muted/30 border-transparent hover:border-border/50'
                  }
                `}
              >
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                      ${layers[key] 
                        ? `${color.replace('text-', 'bg-')}/15 shadow-sm` 
                        : 'bg-muted/50'
                      }
                    `}>
                      <Icon className={`w-4 h-4 ${layers[key] ? color : 'text-muted-foreground'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${layers[key] ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {description}
                      </p>
                    </div>
                  </div>
                  
                  <Switch
                    checked={layers[key]}
                    onCheckedChange={() => onToggleLayer(key)}
                  />
                </div>
                
                {/* Active indicator bar */}
                {layers[key] && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${color.replace('text-', 'bg-')}`} />
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modern Instructions - Minimalist */}
      {!isMobile && (
        <Card className="glass-panel p-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Drag</span> to rotate • <span className="font-medium text-foreground">Scroll</span> to zoom • <span className="font-medium text-foreground">Toggle</span> layers above
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};