import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { HigherMind } from './consciousness/HigherMind';
import { PhysicalBrain } from './consciousness/PhysicalBrain';
import { PhysicalMind } from './consciousness/PhysicalMind';
import { LayerControls } from './consciousness/LayerControls';

export interface LayerState {
  higherMind: boolean;
  physicalBrain: boolean;
  physicalMind: boolean;
}

export const CognitionStream = () => {
  const [layers, setLayers] = useState<LayerState>({
    higherMind: true,
    physicalBrain: true,
    physicalMind: true,
  });

  const toggleLayer = (layer: keyof LayerState) => {
    setLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  return (
    <div className="relative w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        className="bg-transparent"
      >
        <Suspense fallback={null}>
          {/* Ambient lighting */}
          <ambientLight intensity={0.3} color="#4A5FC1" />
          <pointLight position={[10, 10, 10]} intensity={1} color="#F59E0B" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
          
          {/* Starfield background */}
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade={true}
            speed={0.5}
          />
          
          {/* Consciousness layers */}
          {layers.higherMind && <HigherMind />}
          {layers.physicalBrain && <PhysicalBrain />}
          {layers.physicalMind && <PhysicalMind />}
          
          {/* Camera controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      
      {/* Layer controls overlay */}
      <LayerControls
        layers={layers}
        onToggleLayer={toggleLayer}
      />
    </div>
  );
};