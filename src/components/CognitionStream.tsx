import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import { HigherMind } from './consciousness/HigherMind';
import { PhysicalBrain } from './consciousness/PhysicalBrain';
import { PhysicalMind } from './consciousness/PhysicalMind';
import { LayerControls } from './consciousness/LayerControls';
import { SanitizeR3F } from './r3f/SanitizeR3F';

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

  // Mobile detection and performance optimization
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleLayer = (layer: keyof LayerState) => {
    setLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  return (
    <div className="relative w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 15 : 10], fov: isMobile ? 60 : 50 }}
        gl={{ 
          antialias: !isMobile, 
          alpha: true,
          powerPreference: isMobile ? "low-power" : "high-performance"
        }}
        className="bg-transparent"
        dpr={isMobile ? 1 : window.devicePixelRatio}
      >
        <Suspense fallback={null}>
          <SanitizeR3F>
            {/* Reduced lighting for mobile */}
            <ambientLight intensity={isMobile ? 0.4 : 0.3} color="#4A5FC1" />
            {!isMobile && <pointLight position={[10, 10, 10]} intensity={1} color="#F59E0B" />}
            <pointLight position={[-10, -10, -10]} intensity={isMobile ? 0.3 : 0.5} color="#8B5CF6" />
            
            {/* Reduced starfield for mobile */}
            <Stars 
              radius={100} 
              depth={50} 
              count={isMobile ? 1000 : 5000} 
              factor={isMobile ? 2 : 4} 
              saturation={0} 
              fade={true}
              speed={0.5}
            />
            
            {/* Consciousness layers with mobile optimization */}
            {layers.higherMind && <HigherMind isMobile={isMobile} />}
            {layers.physicalBrain && <PhysicalBrain isMobile={isMobile} />}
            {layers.physicalMind && <PhysicalMind isMobile={isMobile} />}
            
            {/* Mobile-optimized camera controls */}
            <OrbitControls
              enableZoom={true}
              enablePan={!isMobile} // Disable pan on mobile to avoid conflicts
              enableRotate={true}
              minDistance={isMobile ? 8 : 5}
              maxDistance={isMobile ? 30 : 50}
              autoRotate={false}
              autoRotateSpeed={0.5}
              enableDamping={true}
              dampingFactor={0.05}
              rotateSpeed={isMobile ? 0.5 : 1}
              zoomSpeed={isMobile ? 0.5 : 1}
              touches={{
                ONE: isMobile ? 2 : 0, // Rotate with one finger on mobile
                TWO: isMobile ? 1 : 0  // Zoom with two fingers on mobile
              }}
            />
          </SanitizeR3F>
        </Suspense>
      </Canvas>
      
      {/* Layer controls overlay */}
      <LayerControls
        layers={layers}
        onToggleLayer={toggleLayer}
        isMobile={isMobile}
      />
    </div>
  );
};