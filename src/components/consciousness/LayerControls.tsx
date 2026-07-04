import { Switch } from '@/components/ui/switch';
import { Brain, Sparkles, Waves, Activity, Atom, Radio } from 'lucide-react';
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
      description: 'Conception field',
      icon: Sparkles,
      color: 'text-consciousness-higher-mind',
      surface: 'bg-consciousness-higher-mind/10',
      border: 'border-consciousness-higher-mind/30',
      bar: 'bg-consciousness-higher-mind'
    },
    {
      key: 'physicalBrain' as keyof LayerState,
      label: 'Physical Brain',
      description: 'Encoding network',
      icon: Brain,
      color: 'text-consciousness-neural-pulse',
      surface: 'bg-consciousness-neural-pulse/10',
      border: 'border-consciousness-neural-pulse/30',
      bar: 'bg-consciousness-neural-pulse'
    },
    {
      key: 'physicalMind' as keyof LayerState,
      label: 'Physical Mind',
      description: 'Perception aura',
      icon: Waves,
      color: 'text-consciousness-physical-mind',
      surface: 'bg-consciousness-physical-mind/10',
      border: 'border-consciousness-physical-mind/30',
      bar: 'bg-consciousness-physical-mind'
    }
  ];

  const activeCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <header className="pointer-events-auto glass-panel animate-fade-in rounded-md px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
              <Atom className="h-3 w-3" />
              X-Lab / Cognitive Flow
            </div>
            <h1 className="truncate font-display text-xl font-semibold text-foreground sm:text-3xl">
              Cognition Stream
            </h1>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-2 rounded-sm border border-primary/25 bg-primary/10 px-3 py-2">
              <Radio className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Live</span>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-muted-foreground">Active layers</div>
              <div className="font-display text-lg font-semibold text-foreground">{activeCount}/3</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <span className="text-xs font-semibold text-primary">{activeCount}/3</span>
            <Activity className="h-4 w-4 text-primary" />
          </div>
        </div>
      </header>

      <section className="pointer-events-auto animate-fade-in self-stretch sm:self-center">
        <div className="glass-panel rounded-md p-2 sm:p-3">
          <div className="grid grid-cols-3 gap-2 sm:min-w-[680px] sm:gap-3">
            {controls.map(({ key, label, description, icon: Icon, color, surface, border, bar }) => (
              <div
                key={key}
                className={`relative overflow-hidden rounded-sm border p-2.5 transition-all duration-300 sm:p-3 ${layers[key] ? `${surface} ${border}` : 'border-border/40 bg-muted/25'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm ${layers[key] ? surface : 'bg-muted/50'}`}>
                      <Icon className={`h-3.5 w-3.5 ${layers[key] ? color : 'text-muted-foreground'}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-foreground sm:text-sm">{label}</div>
                      <div className="hidden text-xs text-muted-foreground sm:block">{description}</div>
                    </div>
                  </div>
                  <Switch
                    checked={layers[key]}
                    onCheckedChange={() => onToggleLayer(key)}
                    className="scale-75 sm:scale-90"
                    aria-label={`Toggle ${label}`}
                  />
                </div>
                <div className="mt-3 h-px w-full bg-border/40">
                  <div className={`h-px transition-all duration-500 ${bar} ${layers[key] ? 'w-full' : 'w-0'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};