"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Environment,
  Float,
  Text,
  Sparkles,
} from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import Link from "next/link";

/* ---------- COIN TEXTURE ---------- */
function createCoinTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  grad.addColorStop(0, "#FFF3B0");
  grad.addColorStop(1, "#B8860B");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#000";
  ctx.font = "bold 90px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("₹", 128, 128);

  return new THREE.CanvasTexture(canvas);
}

/* ---------- COIN ---------- */
function Coin({ onCollect }: { onCollect: () => void }) {
  const ref = useRef<THREE.Mesh>(null!);
  const texture = useMemo(() => createCoinTexture(), []);

  // random initial speed + rotation
  const speed = useMemo(() => 1 + Math.random() * 2, []);
  const spin = useMemo(() => 2 + Math.random() * 4, []);

  useFrame((_, delta) => {
    const mesh = ref.current;

    mesh.position.y -= delta * speed;
    mesh.rotation.y += delta * spin;
    mesh.rotation.x += delta * 1.2;

    // reset when out of screen
    if (mesh.position.y < -3) {
      onCollect();

      mesh.position.set(
        (Math.random() - 0.5) * 8,
        5 + Math.random() * 3,
        (Math.random() - 0.5) * 8
      );
    }
  });

  return (
    <mesh
      ref={ref}
      position={[
        (Math.random() - 0.5) * 8,
        5 + Math.random() * 3,
        (Math.random() - 0.5) * 8,
      ]}
    >
      <cylinderGeometry args={[0.25, 0.25, 0.06, 32]} />
      <meshStandardMaterial
        map={texture}
        metalness={1}
        roughness={0.25}
        emissive="#FFD700"
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

/* ---------- SCENE ---------- */
function Scene() {
  const [money, setMoney] = useState(0);

  return (
    <Canvas
      camera={{ position: [0, 1.5, 7], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#000000"]} />

      {/* LIGHTING (Premium cinematic) */}
      <ambientLight intensity={0.4} />

      <pointLight
        position={[0, 3, 2]}
        intensity={2.5}
        color="#FFD700"
      />

      <spotLight
        position={[0, 6, 0]}
        angle={0.4}
        intensity={2}
        penumbra={1}
        color="#fff1a8"
      />

      {/* FX */}
      <Stars radius={100} depth={50} count={2000} factor={4} />
      <Sparkles count={300} size={2} speed={0.6} />

      {/* COINS */}
      {Array.from({ length: 60 }).map((_, i) => (
        <Coin key={i} onCollect={() => setMoney((m) => m + 10)} />
      ))}

      {/* COUNTER */}
      <Float speed={2}>
        <Text
          position={[0, 2.8, 0]}
          fontSize={0.7}
          color="#FFD700"
          anchorX="center"
        >
          ₹ {money.toLocaleString()}
        </Text>
      </Float>

      <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
      <Environment preset="city" />
    </Canvas>
  );
}

/* ---------- HERO ---------- */
export default function Hero3D() {
  return (
    <section className="relative h-screen w-full bg-black overflow-hidden">

      {/* CANVAS */}
      <div className="absolute inset-0">
        <Scene />
      </div>

      {/* OVERLAY UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">

        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
          Passive Income
        </h1>

        <h2 className="text-3xl md:text-5xl font-bold text-yellow-400 mt-3">
          Starts Here
        </h2>

        <p className="mt-6 text-gray-400 max-w-xl">
          Watch your earnings grow with a powerful network-driven system.
        </p>

        <Link
          href="/register"
          className="
          mt-8 inline-block px-8 py-3
          bg-yellow-400 text-black
          rounded-full font-semibold
          hover:scale-110 hover:shadow-[0_0_30px_#FFD700]
          transition
        "
        >
          Get Started
        </Link>

      </div>
    </section>
  );
}