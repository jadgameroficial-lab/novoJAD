"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, extend, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { BallCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint, type RapierRigidBody } from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { content } from "@/lib/content";
import { interFont, jadWordmarkFont } from "@/lib/fonts";

extend({ MeshLineGeometry, MeshLineMaterial });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CARD_WIDTH = 1.7;
const CARD_HEIGHT = 2.35;
const CARD_DEPTH = 0.07;
const CARD_RADIUS = 0.11;
const FACE_MARGIN = 0.06;
const TEXTURE_W = 900;
const TEXTURE_H = 1240;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

async function buildFrontTexture(photoSrc: string, name: string, title: string, bodyFontFamily: string, wordmarkFontFamily: string) {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_W;
  canvas.height = TEXTURE_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const photoH = TEXTURE_H * 0.68;
  const photo = await loadImage(photoSrc).catch(() => null);

  if (photo) {
    drawCover(ctx, photo, 0, 0, TEXTURE_W, photoH);
  } else {
    const grad = ctx.createLinearGradient(0, 0, 0, photoH);
    grad.addColorStop(0, "#1c1c1e");
    grad.addColorStop(1, "#0a0a0a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, TEXTURE_W, photoH);
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.font = `600 220px ${wordmarkFontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("JAD", TEXTURE_W / 2, photoH / 2);
  }

  ctx.fillStyle = "#f6f6f4";
  ctx.fillRect(0, photoH, TEXTURE_W, TEXTURE_H - photoH);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  if (name) {
    ctx.fillStyle = "#0a0a0a";
    ctx.font = `600 52px ${bodyFontFamily}`;
    ctx.fillText(name, 56, photoH + 96);
  }
  ctx.fillStyle = "rgba(10,10,10,0.55)";
  ctx.font = `500 32px ${bodyFontFamily}`;
  ctx.fillText(title.toUpperCase(), 56, name ? photoH + 148 : photoH + 100);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(10,10,10,0.32)";
  ctx.font = `600 38px ${wordmarkFontFamily}`;
  ctx.fillText("JAD", TEXTURE_W - 56, TEXTURE_H - 52);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function buildBackTexture(wordmarkFontFamily: string) {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_W;
  canvas.height = TEXTURE_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#111113";
  ctx.fillRect(0, 0, TEXTURE_W, TEXTURE_H);
  const vignette = ctx.createLinearGradient(0, 0, 0, TEXTURE_H);
  vignette.addColorStop(0, "rgba(255,255,255,0.05)");
  vignette.addColorStop(0.5, "rgba(255,255,255,0)");
  vignette.addColorStop(1, "rgba(255,255,255,0.05)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, TEXTURE_W, TEXTURE_H);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `400 168px ${wordmarkFontFamily}`;
  ctx.fillText("J A D", TEXTURE_W / 2, TEXTURE_H / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * The visible card. Rendered as a child of the physics `card` RigidBody, so it
 * automatically inherits the rope's swing/position (real physical weight). Its own
 * `flipGroupRef` local rotation/scale is left untouched by physics and is driven
 * exclusively by the GSAP scroll timeline in `DevLanyard`, so the two motions compose
 * (pendulum sway from the rope + the scroll-triggered flip) instead of fighting.
 */
function Card({ isMobile, flipGroupRef }: { isMobile: boolean; flipGroupRef: RefObject<THREE.Group | null> }) {
  const frontMeshRef = useRef<THREE.Mesh>(null);
  const backMeshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    let cancelled = false;
    const { founder } = content.footer;
    const wordmarkFamily = jadWordmarkFont.style.fontFamily;
    const bodyFamily = interFont.style.fontFamily;

    async function build() {
      await document.fonts.ready;
      const [front, back] = await Promise.all([
        buildFrontTexture(founder.photo, founder.name, founder.title, bodyFamily, wordmarkFamily),
        Promise.resolve(buildBackTexture(wordmarkFamily)),
      ]);
      if (cancelled) return;
      if (front && frontMeshRef.current) {
        const material = frontMeshRef.current.material as THREE.MeshPhysicalMaterial;
        material.map = front;
        material.needsUpdate = true;
      }
      if (back && backMeshRef.current) {
        const material = backMeshRef.current.material as THREE.MeshPhysicalMaterial;
        material.map = back;
        material.needsUpdate = true;
      }
    }

    void build();
    return () => {
      cancelled = true;
    };
  }, []);

  const faceW = CARD_WIDTH - FACE_MARGIN * 2;
  const faceH = CARD_HEIGHT - FACE_MARGIN * 2;

  return (
    <group ref={flipGroupRef}>
      <RoundedBox args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} radius={CARD_RADIUS} smoothness={4}>
        <meshPhysicalMaterial
          color="#f2f2ef"
          roughness={0.78}
          metalness={0.04}
          clearcoat={isMobile ? 0 : 0.6}
          clearcoatRoughness={0.28}
        />
      </RoundedBox>
      <mesh ref={frontMeshRef} position={[0, 0, CARD_DEPTH / 2 + 0.002]}>
        <planeGeometry args={[faceW, faceH]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.55} clearcoat={isMobile ? 0 : 0.4} toneMapped={false} />
      </mesh>
      <mesh ref={backMeshRef} position={[0, 0, -CARD_DEPTH / 2 - 0.002]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[faceW, faceH]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.55} clearcoat={isMobile ? 0 : 0.4} toneMapped={false} />
      </mesh>
      <mesh position={[0, CARD_HEIGHT / 2 - 0.16, 0]}>
        <torusGeometry args={[0.08, 0.022, 12, 24]} />
        <meshStandardMaterial color="#161616" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Band({
  isMobile,
  flipGroupRef,
}: {
  isMobile: boolean;
  flipGroupRef: RefObject<THREE.Group | null>;
}) {
  const band = useRef<THREE.Mesh & { geometry: InstanceType<typeof MeshLineGeometry> }>(null);
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);
  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );

  // @react-three/rapier's joint hooks type their ref params as non-nullable RefObject<RigidBody>,
  // but useRef<T>(null) under React 19 always yields RefObject<T | null>; the runtime handles
  // null refs safely (the joint simply attaches once the ref populates), so this cast is sound.
  type RigidBodyRef = RefObject<RapierRigidBody>;
  useRopeJoint(fixed as RigidBodyRef, j1 as RigidBodyRef, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1 as RigidBodyRef, j2 as RigidBodyRef, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2 as RigidBodyRef, j3 as RigidBodyRef, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3 as RigidBodyRef, card as RigidBodyRef, [
    [0, 0, 0],
    [0, CARD_HEIGHT / 2 - 0.1, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state) => {
    if (dragged && card.current) {
      const vec = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      const dir = vec.clone().sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.translation());
      curve.points[2].copy(j1.current.translation());
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 28));

      // Gentle restoring torque so the card settles facing the camera at rest,
      // instead of drifting to an arbitrary yaw (same trick used by React Bits' Lanyard).
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation() as unknown as THREE.Vector3);
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);

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
      <group position={[0, 3.6, 0]}>
        <RigidBody ref={fixed} type="fixed" />
        <RigidBody ref={j1} type="dynamic" position={[0.4, 0, 0]} colliders={false} angularDamping={4} linearDamping={4}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody ref={j2} type="dynamic" position={[0.8, 0, 0]} colliders={false} angularDamping={4} linearDamping={4}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody ref={j3} type="dynamic" position={[1.2, 0, 0]} colliders={false} angularDamping={4} linearDamping={4}>
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody
          ref={card}
          position={[1.6, 0, 0]}
          type={dragged ? "kinematicPosition" : "dynamic"}
          colliders={false}
          angularDamping={4}
          linearDamping={4}
        >
          <BallCollider args={[0.9]} />
          <mesh
            visible={false}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH + 0.3]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
          <Card isMobile={isMobile} flipGroupRef={flipGroupRef} />
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-expect-error meshline JSX intrinsics are registered via extend() at module scope */}
        <meshLineGeometry />
        {/* @ts-expect-error meshline JSX intrinsics are registered via extend() at module scope */}
        <meshLineMaterial color="white" depthTest={false} resolution={isMobile ? [1000, 2000] : [1000, 1000]} lineWidth={0.028} />
      </mesh>
    </>
  );
}

export function DevLanyard() {
  const [isMobile, setIsMobile] = useState(() => (typeof window === "undefined" ? false : window.innerWidth < 768));
  const containerRef = useRef<HTMLDivElement>(null);
  const flipGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let raf = 0;
    let cleanup: (() => void) | undefined;

    const waitForGroup = () => {
      const group = flipGroupRef.current;
      if (!group) {
        raf = requestAnimationFrame(waitForGroup);
        return;
      }

      const baseY = group.position.y;
      const tl = gsap.timeline({ paused: true });
      tl.to(group.rotation, { y: Math.PI, duration: 1.1, ease: "power2.inOut" }, 0)
        .to(group.rotation, { x: -0.14, duration: 0.9, ease: "sine.inOut" }, 0)
        .to(group.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 0.55, ease: "power1.out" }, 0)
        .to(group.position, { y: baseY + 0.06, duration: 0.55, ease: "power1.out" }, 0)
        .to(group.scale, { x: 1, y: 1, z: 1, duration: 1.3, ease: "elastic.out(1, 0.55)" }, 0.55)
        .to(group.position, { y: baseY, duration: 1.3, ease: "elastic.out(1, 0.55)" }, 0.55)
        .to(group.rotation, { y: Math.PI * 2, duration: 1.35, ease: "elastic.out(1, 0.55)" }, 1.1)
        .to(group.rotation, { x: 0, duration: 1.35, ease: "elastic.out(1, 0.55)" }, 1.1)
        .call(() => {
          group.rotation.y = 0;
        });

      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 78%",
        toggleActions: "play none none reverse",
        onEnter: () => tl.play(0),
        onLeaveBack: () => tl.reverse(),
      });

      cleanup = () => {
        trigger.kill();
        tl.kill();
      };
    };

    waitForGroup();
    return () => {
      cancelAnimationFrame(raf);
      cleanup?.();
    };
  }, []);

  return (
    <div ref={containerRef} className="mx-auto h-[26rem] w-full max-w-sm md:h-[32rem] md:max-w-md" aria-hidden="true">
      <Canvas camera={{ position: [0, 0.2, 10.5], fov: 22 }} dpr={[1, isMobile ? 1.5 : 2]}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 5]} intensity={0.6} />
        {!isMobile && (
          <Environment resolution={128} frames={1}>
            <Lightformer intensity={2} color="white" position={[0, 2, 3]} scale={[6, 1, 1]} />
            <Lightformer intensity={1} color="white" position={[-3, -1, 2]} rotation={[0, 0, Math.PI / 4]} scale={[4, 1, 1]} />
            <Lightformer intensity={1.5} color="white" position={[3, 1, 2]} rotation={[0, 0, -Math.PI / 4]} scale={[4, 1, 1]} />
          </Environment>
        )}
        <Physics gravity={[0, -30, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} flipGroupRef={flipGroupRef} />
        </Physics>
      </Canvas>
    </div>
  );
}
