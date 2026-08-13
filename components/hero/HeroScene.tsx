"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface SceneProps {
  reducedMotion: boolean;
  isMobile: boolean;
}

/**
 * Pointer is tracked at the window level rather than through R3F's own canvas
 * events: the canvas is rendered with `pointer-events: none` so the hero copy and
 * CTAs stacked above it stay clickable, which also stops `state.pointer` from
 * ever updating.
 */
function useWindowPointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handle = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", handle, { passive: true });
    return () => window.removeEventListener("pointermove", handle);
  }, []);
  return pointer;
}

function Core({ reducedMotion, isMobile }: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointer = useWindowPointer();

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (reducedMotion) return;
    const t = state.clock.getElapsedTime();
    mesh.rotation.y = t * 0.12;
    mesh.position.y = Math.sin(t * 0.5) * 0.12;
    const targetX = pointer.current.y * 0.18;
    const targetZ = -pointer.current.x * 0.18;
    mesh.rotation.x += (targetX - mesh.rotation.x) * 0.035;
    mesh.rotation.z += (targetZ - mesh.rotation.z) * 0.035;
  });

  return (
    <mesh ref={meshRef} scale={isMobile ? 1.7 : 2.55}>
      <icosahedronGeometry args={[1, isMobile ? 5 : 10]} />
      <MeshDistortMaterial
        color="#08080d"
        roughness={0.12}
        metalness={0.92}
        distort={reducedMotion ? 0 : 0.34}
        speed={reducedMotion ? 0 : 1.15}
      />
    </mesh>
  );
}

export function HeroScene({ reducedMotion, isMobile }: SceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 6.4], fov: 34 }} dpr={[1, isMobile ? 1.5 : 2]}>
      <ambientLight intensity={0.25} />
      <pointLight position={[-3.2, 1.8, 4]} intensity={16} color="#a855f7" distance={14} decay={2} />
      <pointLight position={[3, -1.8, 3.2]} intensity={12} color="#4f7fff" distance={14} decay={2} />
      <pointLight position={[0, 3.4, 2]} intensity={7} color="#ffffff" distance={12} decay={2} />
      {!isMobile && (
        <Environment resolution={128} frames={1}>
          <Lightformer intensity={4} color="#a855f7" position={[-3.2, 1.8, 4]} scale={[5, 5, 1]} />
          <Lightformer intensity={2.6} color="#4f7fff" position={[3, -1.8, 3.2]} scale={[5, 5, 1]} />
          <Lightformer intensity={1.6} color="white" position={[0, 3.4, -2]} scale={[7, 1, 1]} />
        </Environment>
      )}
      <Core reducedMotion={reducedMotion} isMobile={isMobile} />
    </Canvas>
  );
}
