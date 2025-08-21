import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ShaderPoints } from '../ui/ShaderPoints';

// Shaders for GPU-accelerated particle animation
const particleVertexShader = `
  attribute float a_index;
  varying vec3 v_color;
  varying float v_index;
  uniform float u_time;
  uniform float u_size;

  void main() {
    v_color = color;
    v_index = a_index;
    vec3 pos = position;

    // Pulsing motion from the original JS code
    float phase = u_time * 2.0 + a_index * 0.01;
    pos.y += sin(phase) * 0.02;

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    gl_PointSize = u_size;
  }
`;

const particleFragmentShader = `
  varying vec3 v_color;
  varying float v_index;
  uniform float u_time;

  void main() {
    // Color intensity pulsing from original JS
    float colorPhase = u_time * 3.0 + v_index * 0.005;
    float intensity = 0.3 + sin(colorPhase) * 0.3;

    vec3 final_color = v_color * intensity;

    gl_FragColor = vec4(final_color, 0.8);
  }
`;


export const HigherMind = () => {
  const groupRef = useRef<THREE.Group>(null);
  const streamRefs = useRef<THREE.Mesh[]>([]);

  // Create ethereal energy field particles
  const particleCount = 2000;
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const indices = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Spherical distribution around higher mind area
      const radius = 5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.cos(phi) + 8; // Above the figure
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Golden-white ethereal colors
      const intensity = 0.5 + Math.random() * 0.5;
      colors[i3] = intensity * (0.9 + Math.random() * 0.1);     // R
      colors[i3 + 1] = intensity * (0.8 + Math.random() * 0.2); // G
      colors[i3 + 2] = intensity * (0.3 + Math.random() * 0.4); // B

      indices[i] = i;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('a_index', new THREE.BufferAttribute(indices, 1));
    
    return geometry;
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
      {/* Main ethereal particle field (now using shaders) */}
      <ShaderPoints
        geometry={particleGeometry}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={{}}
        pointSize={0.1}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
      />
      
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