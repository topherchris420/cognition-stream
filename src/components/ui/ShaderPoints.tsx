import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';

// Define the props for our component
interface ShaderPointsProps {
  geometry: THREE.BufferGeometry;
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [key: string]: { value: any } };
  pointSize?: number;
  blending?: THREE.Blending;
  transparent?: boolean;
  depthWrite?: boolean;
}

export const ShaderPoints = ({
  geometry,
  vertexShader,
  fragmentShader,
  uniforms,
  pointSize = 1.0,
  ...rest // Pass down other material properties like blending, transparent, etc.
}: ShaderPointsProps) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  // Memoize the uniforms object to prevent re-creations
  const memoizedUniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_size: { value: pointSize },
    ...uniforms,
  }), [uniforms, pointSize]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        uniforms={memoizedUniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        vertexColors={true}
        {...rest}
      />
    </points>
  );
};
