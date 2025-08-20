import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const PhysicalMind = () => {
  const mindRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const perceptionWavesRef = useRef<THREE.Mesh[]>([]);

  // Create perception patterns
  const perceptionPatterns = useMemo(() => {
    const patterns = [];
    for (let i = 0; i < 5; i++) {
      patterns.push({
        radius: 3 + i * 0.8,
        speed: 1 + i * 0.3,
        phase: (i / 5) * Math.PI * 2,
        opacity: 0.3 - i * 0.05
      });
    }
    return patterns;
  }, []);

  // Create flowing perception particles
  const perceptionParticles = useMemo(() => {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Distribute around head and torso area
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 2 + Math.random() * 2;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.cos(phi) * 0.7; // Flattened around torso
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Swirling velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      
      // Teal to purple perception colors
      const hue = Math.random();
      colors[i3] = 0.1 + hue * 0.5;     // R
      colors[i3 + 1] = 0.6 + hue * 0.4; // G
      colors[i3 + 2] = 0.8 + hue * 0.2; // B
    }
    
    return { positions, colors, velocities, count: particleCount };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Animate main mind group
    if (mindRef.current) {
      mindRef.current.rotation.y = time * 0.1;
    }
    
    // Animate aura with consciousness wave
    if (auraRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.1;
      auraRef.current.scale.setScalar(scale);
      
      // Modify the material for dynamic effect
      const material = auraRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.2 + Math.sin(time * 1.5) * 0.1;
    }
    
    // Animate perception wave rings
    perceptionWavesRef.current.forEach((wave, index) => {
      if (wave) {
        const pattern = perceptionPatterns[index];
        const phase = time * pattern.speed + pattern.phase;
        
        wave.rotation.z = phase;
        wave.scale.setScalar(1 + Math.sin(phase * 2) * 0.2);
        
        // Dynamic opacity
        const material = wave.material as THREE.MeshBasicMaterial;
        material.opacity = pattern.opacity * (0.5 + Math.sin(phase * 3) * 0.3);
      }
    });
  });

  return (
    <group ref={mindRef}>
      {/* Main consciousness aura */}
      <mesh ref={auraRef} position={[0, 0, 0]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial
          color="#20B2AA"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Perception wave rings */}
      {perceptionPatterns.map((pattern, index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) perceptionWavesRef.current[index] = el;
          }}
          position={[0, 0, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[pattern.radius, 0.1, 8, 32]} />
          <meshStandardMaterial
            color="#8B5CF6"
            transparent
            opacity={pattern.opacity}
            emissive="#8B5CF6"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      
      {/* Perception interpretation particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={perceptionParticles.positions}
            count={perceptionParticles.count}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={perceptionParticles.colors}
            count={perceptionParticles.count}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Central mind core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color="#20B2AA"
          transparent
          opacity={0.4}
          emissive="#20B2AA"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Interpretation light streams */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 2,
              Math.sin(i * 0.5) * 0.5,
              Math.sin(angle) * 2
            ]}
            rotation={[0, angle, 0]}
          >
            <cylinderGeometry args={[0.01, 0.03, 3, 6]} />
            <meshStandardMaterial
              color="#20B2AA"
              transparent
              opacity={0.6}
              emissive="#20B2AA"
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
};