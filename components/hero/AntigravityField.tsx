"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { computeTargetPosition } from "./particleMath";

interface Particle {
  t: number;
  speed: number;
  mx: number;
  my: number;
  mz: number;
  cx: number;
  cy: number;
  cz: number;
  randomRadiusOffset: number;
}

export interface AntigravityFieldProps {
  count?: number;
  color?: string;
  reducedMotion?: boolean;
  className?: string;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: "capsule" | "sphere" | "box" | "tetrahedron";
  fieldStrength?: number;
}

type InnerProps = Required<Omit<AntigravityFieldProps, "className">>;

function AntigravityInner({
  count,
  color,
  reducedMotion,
  magnetRadius,
  ringRadius,
  waveSpeed,
  waveAmplitude,
  particleSize,
  lerpSpeed,
  autoAnimate,
  particleVariance,
  rotationSpeed,
  depthFactor,
  pulseSpeed,
  particleShape,
  fieldStrength,
}: InnerProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const virtualMouse = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);
  const particlesRef = useRef<Particle[]>([]);

  // Particle seeding uses Math.random, an impure operation, so it belongs in an
  // effect (runs once per relevant dependency change) rather than in a render-time
  // memo, per React's rules for pure render/useMemo bodies.
  useEffect(() => {
    const width = viewport.width || 20;
    const height = viewport.height || 20;
    particlesRef.current = Array.from({ length: count }, () => {
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 6;
      return {
        t: Math.random() * 100,
        speed: 0.01 + Math.random() / 200,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        randomRadiusOffset: (Math.random() - 0.5) * 2,
      };
    });
  }, [count, viewport.width, viewport.height]);

  useFrame((state) => {
    const mesh = meshRef.current;
    const particles = particlesRef.current;
    if (!mesh || particles.length === 0) return;

    const { viewport: v, pointer } = state;
    const mouseDist = Math.hypot(pointer.x - lastMousePos.current.x, pointer.y - lastMousePos.current.y);
    if (mouseDist > 0.001) {
      lastMouseMoveTime.current = Date.now();
      lastMousePos.current = { x: pointer.x, y: pointer.y };
    }

    let destX = (pointer.x * v.width) / 2;
    let destY = (pointer.y * v.height) / 2;

    if (autoAnimate && !reducedMotion && Date.now() - lastMouseMoveTime.current > 2000) {
      const time = state.clock.getElapsedTime();
      destX = Math.sin(time * 0.5) * (v.width / 4);
      destY = Math.cos(time * 0.5 * 2) * (v.height / 4);
    }

    const smoothFactor = reducedMotion ? 0.02 : 0.05;
    virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

    const globalRotation = reducedMotion ? 0 : state.clock.getElapsedTime() * rotationSpeed;
    const params = {
      magnetRadius,
      ringRadius,
      waveSpeed: reducedMotion ? 0 : waveSpeed,
      waveAmplitude: reducedMotion ? 0 : waveAmplitude,
      fieldStrength,
      depthFactor,
      globalRotation,
    };
    const effectiveLerpSpeed = reducedMotion ? Math.min(lerpSpeed, 0.03) : lerpSpeed;

    particles.forEach((particle, i) => {
      particle.t += particle.speed / 2;
      const target = computeTargetPosition(particle, virtualMouse.current.x, virtualMouse.current.y, params);
      particle.cx += (target.x - particle.cx) * effectiveLerpSpeed;
      particle.cy += (target.y - particle.cy) * effectiveLerpSpeed;
      particle.cz += (target.z - particle.cz) * effectiveLerpSpeed;

      dummy.position.set(particle.cx, particle.cy, particle.cz);
      dummy.lookAt(virtualMouse.current.x, virtualMouse.current.y, particle.cz);
      dummy.rotateX(Math.PI / 2);

      const distToMouse = Math.hypot(particle.cx - virtualMouse.current.x, particle.cy - virtualMouse.current.y);
      const distFromRing = Math.abs(distToMouse - ringRadius);
      const scaleFactor = Math.max(0, Math.min(1, 1 - distFromRing / 10));
      const pulse = reducedMotion ? 1 : 0.8 + Math.sin(particle.t * pulseSpeed) * 0.2 * particleVariance;
      const finalScale = scaleFactor * pulse * particleSize;
      dummy.scale.setScalar(finalScale);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === "sphere" && <sphereGeometry args={[0.02, 12, 12]} />}
      {particleShape === "box" && <boxGeometry args={[0.03, 0.03, 0.03]} />}
      {particleShape === "tetrahedron" && <tetrahedronGeometry args={[0.03]} />}
      {particleShape === "capsule" && <capsuleGeometry args={[0.004, 0.028, 2, 5]} />}
      <meshBasicMaterial color={color} transparent opacity={0.55} />
    </instancedMesh>
  );
}

export function AntigravityField({
  count = 300,
  color = "#d4d4dc",
  reducedMotion = false,
  className,
  magnetRadius = 5,
  ringRadius = 2.6,
  waveSpeed = 0.15,
  waveAmplitude = 0.4,
  particleSize = 1,
  lerpSpeed = 0.025,
  autoAnimate = false,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = "capsule",
  fieldStrength = 14,
}: AntigravityFieldProps) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 14], fov: 35 }} dpr={[1, 2]}>
        <AntigravityInner
          count={count}
          color={color}
          reducedMotion={reducedMotion}
          magnetRadius={magnetRadius}
          ringRadius={ringRadius}
          waveSpeed={waveSpeed}
          waveAmplitude={waveAmplitude}
          particleSize={particleSize}
          lerpSpeed={lerpSpeed}
          autoAnimate={autoAnimate}
          particleVariance={particleVariance}
          rotationSpeed={rotationSpeed}
          depthFactor={depthFactor}
          pulseSpeed={pulseSpeed}
          particleShape={particleShape}
          fieldStrength={fieldStrength}
        />
      </Canvas>
    </div>
  );
}
