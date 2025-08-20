import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const HigherMind = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const streamRefs = useRef<THREE.Mesh[]>([]);

  // Create ethereal energy field particles
  const particleCount = 2000;
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Spherical distribution around higher mind area
      const radius = 5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.cos(phi) + 8; // Above the figure
      positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Golden-white ethereal colors
      const intensity = 0.5 + Math.random() * 0.5;
      colors[i] = intensity * (0.9 + Math.random() * 0.1);     // R
      colors[i + 1] = intensity * (0.8 + Math.random() * 0.2); // G
      colors[i + 2] = intensity * (0.3 + Math.random() * 0.4); // B
    }
    
    return { positions, colors };
  }, []);

  // Create fractal energy streams
  const energyStreams = useMemo(() => {
    const streams = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const stream = {
        start: new THREE.Vector3(
          Math.cos(angle) * 6,
          8,
          Math.sin(angle) * 6
        ),
        end: new THREE.Vector3(
          Math.cos(angle) * 2,
          2,
          Math.sin(angle) * 2
        ),
        phase: Math.random() * Math.PI * 2
      };
      streams.push(stream);
    }
    return streams;
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Animate main energy field
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.3;
    }
    
    // Animate particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        // Pulsing motion
        const phase = time * 2 + i * 0.01;
        positions[i + 1] += Math.sin(phase) * 0.002;
        
        // Color intensity pulsing
        const colorPhase = time * 3 + i * 0.005;
        const intensity = 0.3 + Math.sin(colorPhase) * 0.3;
        colors[i] *= intensity;
        colors[i + 1] *= intensity;
        colors[i + 2] *= intensity;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true;
    }
    
    // Animate energy streams
    streamRefs.current.forEach((stream, index) => {
      if (stream) {
        const phase = time * 2 + energyStreams[index].phase;
        stream.position.y = energyStreams[index].start.y + Math.sin(phase) * 0.5;
        stream.rotation.z = time * 0.3 + index * 0.2;
        
        // Pulsing scale
        const scale = 1 + Math.sin(time * 4 + index) * 0.2;
        stream.scale.setScalar(scale);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Main ethereal particle field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={particleCount}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={colors}
            count={particleCount}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
        />
      </points>
      
      {/* Fractal energy streams */}
      {energyStreams.map((stream, index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) streamRefs.current[index] = el;
          }}
          position={stream.start}
        >
          <cylinderGeometry args={[0.02, 0.05, 6, 8]} />
          <meshStandardMaterial
            color="#F59E0B"
            transparent
            opacity={0.6}
            emissive="#F59E0B"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      
      {/* Central radiant core */}
      <mesh position={[0, 8, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#FEF3C7"
          transparent
          opacity={0.4}
          emissive="#F59E0B"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};