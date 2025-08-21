import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ShaderPoints } from '../ui/ShaderPoints';

// Shaders for GPU-accelerated neuron animation
const neuronVertexShader = `
  attribute float a_random;
  varying vec3 v_color;
  varying vec3 v_position;
  varying float v_random;
  uniform float u_size;

  void main() {
    v_color = color;
    v_position = position;
    v_random = a_random;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    gl_PointSize = u_size;
  }
`;

const neuronFragmentShader = `
  uniform float u_time;
  varying vec3 v_color;
  varying vec3 v_position;
  varying float v_random;

  void main() {
    float wavePhase = u_time * 3.0 + length(v_position) * 0.5;
    float activity = 0.3 + sin(wavePhase) * 0.4 + v_random * 0.3;

    float r = 0.1 + activity * 0.5;
    float g = 0.2 + activity * 0.7;
    float b = 0.8 + activity * 0.2;

    vec3 final_color = vec3(r, g, b);

    float intensity = smoothstep(0.5, 1.0, activity);
    gl_FragColor = vec4(final_color, intensity * 0.9);
  }
`;


interface PhysicalBrainProps {
  isMobile?: boolean;
}

export const PhysicalBrain = ({ isMobile = false }: PhysicalBrainProps) => {
  const brainRef = useRef<THREE.Group>(null);
  const synapsesRef = useRef<THREE.LineSegments>(null);

  // Generate neural network structure with mobile optimization
  const neuralNetwork = useMemo(() => {
    const neurons = [];
    const connections = [];
    const neuronCount = isMobile ? 250 : 500;
    
    // Create neurons in brain-like distribution
    for (let i = 0; i < neuronCount; i++) {
      // Brain-shaped ellipsoid distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.random();
      
      const x = Math.pow(r, 1/3) * 2.5 * Math.sin(phi) * Math.cos(theta);
      const y = Math.pow(r, 1/3) * 2 * Math.cos(phi) + 1; // Centered at head level
      const z = Math.pow(r, 1/3) * 2.5 * Math.sin(phi) * Math.sin(theta);
      
      neurons.push({
        position: new THREE.Vector3(x, y, z),
        activity: Math.random(),
        connections: []
      });
    }
    
    // Create connections between nearby neurons
    const connectionPositions = [];
    const connectionColors = [];
    
    for (let i = 0; i < neuronCount; i++) {
      for (let j = i + 1; j < neuronCount; j++) {
        const distance = neurons[i].position.distanceTo(neurons[j].position);
        
        if (distance < 1.5 && Math.random() < 0.1) {
          neurons[i].connections.push(j);
          
          // Add line positions
          connectionPositions.push(
            neurons[i].position.x, neurons[i].position.y, neurons[i].position.z,
            neurons[j].position.x, neurons[j].position.y, neurons[j].position.z
          );
          
          // Neural activity colors (blue to purple spectrum)
          const activity = (neurons[i].activity + neurons[j].activity) / 2;
          connectionColors.push(
            0.2 + activity * 0.3, 0.3 + activity * 0.5, 0.8 + activity * 0.2,
            0.2 + activity * 0.3, 0.3 + activity * 0.5, 0.8 + activity * 0.2
          );
        }
      }
    }
    
    return {
      neurons,
      connectionPositions: new Float32Array(connectionPositions),
      connectionColors: new Float32Array(connectionColors)
    };
  }, [isMobile]);

  // Create neuron geometry for shader points
  const neuronGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(neuralNetwork.neurons.length * 3);
    const colors = new Float32Array(neuralNetwork.neurons.length * 3);
    const randoms = new Float32Array(neuralNetwork.neurons.length);
    
    neuralNetwork.neurons.forEach((neuron, i) => {
      positions[i * 3] = neuron.position.x;
      positions[i * 3 + 1] = neuron.position.y;
      positions[i * 3 + 2] = neuron.position.z;
      
      // Initial colors
      const activity = neuron.activity;
      colors[i * 3] = 0.1 + activity * 0.4;
      colors[i * 3 + 1] = 0.2 + activity * 0.6;
      colors[i * 3 + 2] = 0.8 + activity * 0.2;

      // Random attribute for shader
      randoms[i] = Math.random();
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('a_random', new THREE.BufferAttribute(randoms, 1));
    
    return geometry;
  }, [neuralNetwork]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Subtle brain rotation and pulsing
    if (brainRef.current) {
      brainRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
      const scale = 1 + Math.sin(time * 1.5) * 0.05;
      brainRef.current.scale.setScalar(scale);
    }
        
    // Animate synaptic connections (still on CPU for now)
    if (synapsesRef.current) {
      const colors = synapsesRef.current.geometry.attributes.color.array as Float32Array;
      
      for (let i = 0; i < colors.length; i += 6) {
        const connectionPhase = time * 5 + i * 0.01;
        const intensity = 0.2 + Math.sin(connectionPhase) * 0.3;
        
        // Update both vertices of the line
        colors[i] = intensity * 0.4;
        colors[i + 1] = intensity * 0.6;
        colors[i + 2] = intensity;
        colors[i + 3] = intensity * 0.4;
        colors[i + 4] = intensity * 0.6;
        colors[i + 5] = intensity;
      }
      
      synapsesRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <group ref={brainRef}>
      {/* Semi-transparent brain outline */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[2.8, isMobile ? 16 : 32, isMobile ? 16 : 32]} />
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0.1}
          wireframe={false}
        />
      </mesh>
      
      {/* Neural network nodes (now using shaders) */}
      <ShaderPoints
        geometry={neuronGeometry}
        vertexShader={neuronVertexShader}
        fragmentShader={neuronFragmentShader}
        uniforms={{}}
        pointSize={0.05}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
      
      {/* Synaptic connections */}
      <lineSegments ref={synapsesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={neuralNetwork.connectionPositions}
            count={neuralNetwork.connectionPositions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={neuralNetwork.connectionColors}
            count={neuralNetwork.connectionColors.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};