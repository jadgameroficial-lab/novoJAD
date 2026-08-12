"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, extend, useFrame, type ThreeEvent } from "@react-three/fiber";
import { BallCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint, type RapierRigidBody } from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

extend({ MeshLineGeometry, MeshLineMaterial });

function cardTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0a0a0a";
    ctx.font = "bold 64px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("JAD", canvas.width / 2, canvas.height / 2 + 24);
    ctx.font = "500 16px sans-serif";
    ctx.fillStyle = "rgba(10,10,10,0.55)";
    ctx.fillText("ENGENHARIA DIGITAL INTELIGENTE", canvas.width / 2, canvas.height / 2 + 60);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function Band({ isMobile }: { isMobile: boolean }) {
  const band = useRef<THREE.Mesh & { geometry: InstanceType<typeof MeshLineGeometry> }>(null);
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);
  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const texture = useMemo(() => cardTexture(), []);
  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );

  // @react-three/rapier's joint hooks type their ref params as non-nullable RefObject<RigidBody>,
  // but useRef<T>(null) under React 19 always yields RefObject<T | null>; the runtime handles
  // null refs safely (the joint simply attaches once the ref populates), so this cast is sound.
  type RigidBodyRef = RefObject<RapierRigidBody>;
  useRopeJoint(fixed as RigidBodyRef, j1 as RigidBodyRef, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1 as RigidBodyRef, j2 as RigidBodyRef, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j2 as RigidBodyRef, card as RigidBodyRef, [
    [0, 0, 0],
    [0, 1.2, 0],
  ]);

  useFrame((state) => {
    if (dragged && card.current) {
      const vec = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      const dir = vec.clone().sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && j1.current && j2.current && card.current && band.current) {
      curve.points[0].copy(j1.current.translation());
      curve.points[1].copy(j2.current.translation());
      curve.points[2].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(24));
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    const translation = card.current?.translation();
    if (!translation) return;
    setDragged(new THREE.Vector3().copy(e.point).sub(new THREE.Vector3(translation.x, translation.y, translation.z)));
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    (e.target as Element).releasePointerCapture(e.pointerId);
    setDragged(false);
  };

  return (
    <>
      <group position={[0, 3, 0]}>
        <RigidBody ref={fixed} type="fixed" />
        <RigidBody ref={j1} type="dynamic" position={[0.4, 0, 0]} colliders={false} angularDamping={4} linearDamping={4}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody ref={j2} type="dynamic" position={[0.8, 0, 0]} colliders={false} angularDamping={4} linearDamping={4}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody
          ref={card}
          position={[1.2, 0, 0]}
          type={dragged ? "kinematicPosition" : "dynamic"}
          colliders={false}
          angularDamping={4}
          linearDamping={4}
        >
          <BallCollider args={[0.6]} />
          <mesh scale={1.4} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
            <planeGeometry args={[0.8, 1]} />
            <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-expect-error meshline JSX intrinsics are registered via extend() at module scope */}
        <meshLineGeometry />
        {/* @ts-expect-error meshline JSX intrinsics are registered via extend() at module scope */}
        <meshLineMaterial color="white" depthTest={false} resolution={isMobile ? [1000, 2000] : [1000, 1000]} lineWidth={0.03} />
      </mesh>
    </>
  );
}

export function DevLanyard() {
  const [isMobile, setIsMobile] = useState(() => (typeof window === "undefined" ? false : window.innerWidth < 768));
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="mx-auto h-72 w-full max-w-xs" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 8], fov: 20 }} dpr={[1, isMobile ? 1.5 : 2]}>
        <ambientLight intensity={2} />
        <Physics gravity={[0, -30, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
      </Canvas>
    </div>
  );
}
