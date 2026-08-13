"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

interface CoreProps {
  reducedMotion: boolean;
  isMobile: boolean;
}

function Core({ reducedMotion, isMobile }: CoreProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh || reducedMotion) return;
    const t = state.clock.getElapsedTime();
    mesh.rotation.y = t * 0.14;
    mesh.position.y = Math.sin(t * 0.6) * 0.14;
    const targetTiltX = state.pointer.y * 0.16;
    const targetTiltZ = -state.pointer.x * 0.16;
    mesh.rotation.x += (targetTiltX - mesh.rotation.x) * 0.04;
    mesh.rotation.z += (targetTiltZ - mesh.rotation.z) * 0.04;
  });

  return (
    <mesh ref={meshRef} scale={isMobile ? 1.5 : 2.3}>
      <icosahedronGeometry args={[1, isMobile ? 5 : 9]} />
      <MeshDistortMaterial
        color="#0b0b10"
        roughness={0.18}
        metalness={0.85}
        distort={reducedMotion ? 0 : 0.32}
        speed={reducedMotion ? 0 : 1.3}
      />
    </mesh>
  );
}

export function HeroScene({ reducedMotion, isMobile }: CoreProps) {
  return (
    <Canvas camera={{ position: [0, 0, 6.2], fov: 32 }} dpr={[1, isMobile ? 1.5 : 2]}>
      <ambientLight intensity={0.35} />
      <pointLight position={[-3, 2, 4]} intensity={14} color="#8b5cf6" distance={13} decay={2} />
      <pointLight position={[3, -1.5, 3]} intensity={11} color="#4f7fff" distance={13} decay={2} />
      {!isMobile && (
        <Environment resolution={128} frames={1}>
          <Lightformer intensity={3} color="#8b5cf6" position={[-3, 2, 4]} scale={[4, 4, 1]} />
          <Lightformer intensity={2.2} color="#4f7fff" position={[3, -1.5, 3]} scale={[4, 4, 1]} />
          <Lightformer intensity={1.4} color="white" position={[0, 3, -2]} scale={[6, 1, 1]} />
        </Environment>
      )}
      <Core reducedMotion={reducedMotion} isMobile={isMobile} />
    </Canvas>
  );
}
