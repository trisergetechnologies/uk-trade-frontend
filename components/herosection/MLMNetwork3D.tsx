// // // components/Hero.tsx
// // 'use client';

// // import { useRef, useMemo, useEffect } from 'react';
// // import { Canvas, useFrame } from '@react-three/fiber';
// // import {
// //   OrbitControls,
// //   Sphere,
// //   TorusKnot,
// //   Stars,
// //   Environment,
// //   Float,
// //   MeshDistortMaterial,
// //   Sparkles,
// //   Line,
// //   Cylinder,
// // } from '@react-three/drei';
// // import { Group, Mesh, Vector3, CanvasTexture, MeshStandardMaterial, CylinderGeometry } from 'three';

// // // Central animated knot
// // function CentralKnot() {
// //   const knotRef = useRef<Mesh>(null);
// //   useFrame(({ clock }) => {
// //     if (knotRef.current) {
// //       knotRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
// //       knotRef.current.rotation.y = clock.getElapsedTime() * 0.2;
// //       knotRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
// //     }
// //   });
// //   return (
// //     <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
// //       <TorusKnot ref={knotRef} args={[1.2, 0.28, 180, 24, 3, 4]} scale={1}>
// //         <MeshDistortMaterial
// //           color="#a855f7"
// //           emissive="#6b21a8"
// //           emissiveIntensity={0.6}
// //           metalness={0.8}
// //           roughness={0.2}
// //           clearcoat={1}
// //           clearcoatRoughness={0.1}
// //           distort={0.3}
// //           speed={2}
// //         />
// //       </TorusKnot>
// //     </Float>
// //   );
// // }

// // // Orbiting nodes
// // function OrbitingNodes() {
// //   const groupRef = useRef<Group>(null);
// //   const nodeCount = 12;
// //   const radius = 2.8;
// //   const colors = useMemo(
// //     () => Array.from({ length: nodeCount }, () => [`hsl(${Math.random() * 60 + 260}, 80%, 65%)`, `hsl(${Math.random() * 60 + 260}, 80%, 45%)`]),
// //     []
// //   );
// //   useFrame(({ clock }) => {
// //     if (groupRef.current) {
// //       groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
// //       groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
// //       groupRef.current.rotation.z = Math.cos(clock.getElapsedTime() * 0.18) * 0.1;
// //     }
// //   });
// //   return (
// //     <group ref={groupRef}>
// //       {Array.from({ length: nodeCount }).map((_, i) => {
// //         const angle = (i / nodeCount) * Math.PI * 2;
// //         const x = Math.cos(angle) * radius;
// //         const z = Math.sin(angle) * radius;
// //         const yOffset = Math.sin(angle * 3) * 0.8;
// //         return (
// //           <Float key={i} speed={0.8 + i * 0.1} rotationIntensity={0.3} floatIntensity={0.5} position={[x, yOffset, z]}>
// //             <Sphere args={[0.18, 16, 16]}>
// //               <MeshDistortMaterial color={colors[i][0]} emissive={colors[i][1]} emissiveIntensity={0.4} metalness={0.3} roughness={0.4} distort={0.2} />
// //             </Sphere>
// //           </Float>
// //         );
// //       })}
// //       {Array.from({ length: 8 }).map((_, i) => {
// //         const angle = (i / 8) * Math.PI * 2;
// //         const x = Math.cos(angle) * 1.8;
// //         const z = Math.sin(angle) * 1.8;
// //         return (
// //           <Float key={`inner-${i}`} speed={1.2} floatIntensity={0.3} position={[x, 0.4, z]}>
// //             <Sphere args={[0.1, 12, 12]}>
// //               <MeshDistortMaterial color="#c084fc" emissive="#7e22ce" emissiveIntensity={0.5} distort={0.1} />
// //             </Sphere>
// //           </Float>
// //         );
// //       })}
// //     </group>
// //   );
// // }

// // // Connecting lines
// // function NetworkLines() {
// //   const linesRef = useRef<Group>(null);
// //   const nodeCount = 12;
// //   const radius = 2.8;
// //   const nodePositions = useMemo(() => {
// //     const positions = [];
// //     for (let i = 0; i < nodeCount; i++) {
// //       const angle = (i / nodeCount) * Math.PI * 2;
// //       const x = Math.cos(angle) * radius;
// //       const z = Math.sin(angle) * radius;
// //       const y = Math.sin(angle * 3) * 0.8;
// //       positions.push(new Vector3(x, y, z));
// //     }
// //     return positions;
// //   }, []);
// //   useFrame(({ clock }) => {
// //     if (linesRef.current) {
// //       linesRef.current.rotation.y = clock.getElapsedTime() * 0.15;
// //       linesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
// //     }
// //   });
// //   const lines = useMemo(() => {
// //     const result = [];
// //     for (let i = 0; i < nodePositions.length; i++) {
// //       for (let j = i + 1; j < nodePositions.length; j++) {
// //         if (Math.random() > 0.4) continue;
// //         result.push(<Line key={`line-${i}-${j}`} points={[nodePositions[i], nodePositions[j]]} color="#a855f7" opacity={0.25} transparent lineWidth={1} />);
// //       }
// //     }
// //     return result;
// //   }, [nodePositions]);
// //   return <group ref={linesRef}>{lines}</group>;
// // }

// // // Floating particles
// // function DataStreams() {
// //   return (
// //     <Sparkles
// //       count={800}
// //       speed={0.4}
// //       size={0.08}
// //       color="#c084fc"
// //       opacity={0.6}
// //     />
// //   );
// // }

// // // Generate Indian Rupee coin texture
// // function createRupeeTexture() {
// //   const canvas = document.createElement('canvas');
// //   canvas.width = 512;
// //   canvas.height = 512;
// //   const ctx = canvas.getContext('2d')!;
  
// //   // Background gold gradient
// //   const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
// //   grad.addColorStop(0, '#f6b93b');
// //   grad.addColorStop(0.5, '#e67e22');
// //   grad.addColorStop(1, '#d35400');
// //   ctx.fillStyle = grad;
// //   ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, Math.PI * 2);
// //   ctx.fill();
  
// //   // Outer border
// //   ctx.strokeStyle = '#f1c40f';
// //   ctx.lineWidth = 20;
// //   ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2 - 15, 0, Math.PI * 2);
// //   ctx.stroke();
  
// //   // Inner circle
// //   ctx.strokeStyle = '#f39c12';
// //   ctx.lineWidth = 8;
// //   ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2 - 50, 0, Math.PI * 2);
// //   ctx.stroke();
  
// //   // Rupee symbol
// //   ctx.fillStyle = '#2c3e50';
// //   ctx.font = `bold ${canvas.width * 0.45}px "Segoe UI", "Arial"`;
// //   ctx.textAlign = 'center';
// //   ctx.textBaseline = 'middle';
// //   ctx.fillText('₹', canvas.width/2, canvas.height/2);
  
// //   // Small text
// //   ctx.font = `bold ${canvas.width * 0.1}px "Segoe UI", "Arial"`;
// //   ctx.fillStyle = '#2c3e50';
// //   ctx.fillText('INDIA', canvas.width/2, canvas.height - 80);
  
// //   // Dots pattern around edge
// //   ctx.fillStyle = '#f1c40f';
// //   for (let i = 0; i < 72; i++) {
// //     const angle = (i / 72) * Math.PI * 2;
// //     const x = canvas.width/2 + Math.cos(angle) * (canvas.width/2 - 25);
// //     const y = canvas.height/2 + Math.sin(angle) * (canvas.height/2 - 25);
// //     ctx.beginPath();
// //     ctx.arc(x, y, 8, 0, Math.PI * 2);
// //     ctx.fill();
// //   }
  
// //   const texture = new CanvasTexture(canvas);
// //   texture.needsUpdate = true;
// //   return texture;
// // }

// // // Falling Indian Coins
// // function FallingCoins() {
// //   const coinCount = 400;
// //   const meshesRef = useRef<Mesh[]>([]);
// //   const speedsRef = useRef<number[]>([]);
// //   const rotSpeedsRef = useRef<{ x: number; y: number; z: number }[]>([]);
  
// //   // Shared resources
// //   const coinTexture = useMemo(() => createRupeeTexture(), []);
// //   const coinGeometry = useMemo(() => new CylinderGeometry(0.28, 0.28, 0.06, 32), []);
// //   const coinMaterial = useMemo(() => new MeshStandardMaterial({
// //     map: coinTexture,
// //     metalness: 0.85,
// //     roughness: 0.25,
// //     emissive: '#442200',
// //     emissiveIntensity: 0.1,
// //     color: '#ffaa33',
// //   }), [coinTexture]);
  
// //   // Initialize coin positions and speeds
// //   useEffect(() => {
// //     if (meshesRef.current.length !== coinCount) return;
    
// //     for (let i = 0; i < coinCount; i++) {
// //       const mesh = meshesRef.current[i];
// //       // Random position within visible area
// //       mesh.position.x = (Math.random() - 0.5) * 9; // -4.5 to 4.5
// //       mesh.position.y = Math.random() * 6 + 1; // 1 to 7
// //       mesh.position.z = (Math.random() - 0.5) * 8; // -4 to 4
      
// //       // Random rotation
// //       mesh.rotation.x = Math.random() * Math.PI * 2;
// //       mesh.rotation.y = Math.random() * Math.PI * 2;
// //       mesh.rotation.z = Math.random() * Math.PI * 2;
      
// //       // Falling speed (units per second)
// //       speedsRef.current[i] = 0.8 + Math.random() * 2.2;
      
// //       // Rotation speed (radians per second)
// //       rotSpeedsRef.current[i] = {
// //         x: (Math.random() - 0.5) * 3,
// //         y: (Math.random() - 0.5) * 3,
// //         z: (Math.random() - 0.5) * 2,
// //       };
// //     }
// //   }, [coinCount]);
  
// //   useFrame((_, delta) => {
// //     // Clamp delta to avoid large jumps
// //     const safeDelta = Math.min(delta, 0.033);
    
// //     for (let i = 0; i < coinCount; i++) {
// //       const mesh = meshesRef.current[i];
// //       if (!mesh) continue;
      
// //       // Move downward
// //       mesh.position.y -= speedsRef.current[i] * safeDelta;
      
// //       // Rotate coin
// //       mesh.rotation.x += rotSpeedsRef.current[i].x * safeDelta;
// //       mesh.rotation.y += rotSpeedsRef.current[i].y * safeDelta;
// //       mesh.rotation.z += rotSpeedsRef.current[i].z * safeDelta;
      
// //       // Respawn when below view
// //       if (mesh.position.y < -2.5) {
// //         // Reset position at top with random X,Z
// //         mesh.position.x = (Math.random() - 0.5) * 9;
// //         mesh.position.y = 5 + Math.random() * 3;
// //         mesh.position.z = (Math.random() - 0.5) * 8;
        
// //         // Randomize speed for variety
// //         speedsRef.current[i] = 0.8 + Math.random() * 2.2;
        
// //         // Randomize rotation speeds
// //         rotSpeedsRef.current[i] = {
// //           x: (Math.random() - 0.5) * 3,
// //           y: (Math.random() - 0.5) * 3,
// //           z: (Math.random() - 0.5) * 2,
// //         };
        
// //         // Give a little random initial rotation
// //         mesh.rotation.x = Math.random() * Math.PI * 2;
// //         mesh.rotation.y = Math.random() * Math.PI * 2;
// //         mesh.rotation.z = Math.random() * Math.PI * 2;
// //       }
// //     }
// //   });
  
// //   // Create all coin meshes
// //   return (
// //     <group>
// //       {Array.from({ length: coinCount }).map((_, i) => (
// //         <mesh
// //           key={i}
// //           ref={(el) => {
// //             if (el) meshesRef.current[i] = el;
// //           }}
// //           geometry={coinGeometry}
// //           material={coinMaterial}
// //           castShadow
// //           receiveShadow={false}
// //         />
// //       ))}
// //     </group>
// //   );
// // }

// // // Main 3D Scene
// // function ThreeScene() {
// //   return (
// //     <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }} style={{ background: 'transparent' }} gl={{ antialias: true, alpha: false }}>
// //       <ambientLight intensity={0.4} />
// //       <directionalLight position={[5, 5, 5]} intensity={0.8} />
// //       <directionalLight position={[-5, 3, 2]} intensity={0.5} color="#a855f7" />
// //       <pointLight position={[0, 2, 3]} intensity={0.6} color="#d8b4fe" />
// //       <Stars radius={50} depth={50} count={2000} factor={4} saturation={0.5} fade speed={0.5} />
// //       <CentralKnot />
// //       <OrbitingNodes />
// //       <NetworkLines />
// //       <DataStreams />
// //       <FallingCoins />
// //       <Environment preset="night" background={false} />
// //       <OrbitControls enableZoom enablePan={false} zoomSpeed={0.5} rotateSpeed={0.8} autoRotate={false} maxPolarAngle={Math.PI / 2.2} minDistance={3} maxDistance={9} />
// //     </Canvas>
// //   );
// // }

// // // Hero component
// // export default function Hero3D() {
// //   return (
// //     <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
// //       <div className="absolute inset-0 z-0">
// //         <ThreeScene />
// //       </div>
// //       <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
// //         <div className="mb-6 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300 backdrop-blur-sm">
// //           ✨ Next Generation MLM Platform
// //         </div>
// //         <h1 className="mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl md:text-8xl">
// //           MLM
// //         </h1>
// //         <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 sm:text-xl">
// //           Revolutionize your network marketing with cutting-edge 3D visualization, real-time analytics, and seamless team management.
// //         </p>
// //         <div className="flex flex-wrap justify-center gap-4">
// //           <button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25">
// //             <span className="relative z-10">Get Started Free</span>
// //             <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-purple-700 to-pink-700 transition-transform duration-300 group-hover:translate-x-0"></div>
// //           </button>
// //           <button className="rounded-full border border-purple-400/40 bg-white/5 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-lg">
// //             Watch Demo
// //           </button>
// //         </div>
// //         <div className="absolute bottom-8 left-0 right-0 flex flex-wrap justify-center gap-6 text-sm text-gray-400 sm:gap-12">
// //           <div className="flex items-center gap-2">
// //             <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
// //             <span>10K+ Active Networks</span>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
// //             <span>Real-time Commissions</span>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
// //             <span>3D Analytics Dashboard</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// ////////////////////////////////////new

// 'use client';

// import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import {
//   OrbitControls,
//   Stars,
//   Environment,
//   Text,
//   Sparkles,
//   Float,
//   Sphere,
//   Line,
// } from '@react-three/drei';
// import { Group, Mesh, Vector3, CanvasTexture, CylinderGeometry, PlaneGeometry, MeshStandardMaterial } from 'three';

// /* ---------- UTILITY: Create Indian ₹ Coin Texture (Gold + Ashoka style) ---------- */
// function createRupeeCoinTexture() {
//   const canvas = document.createElement('canvas');
//   canvas.width = 512;
//   canvas.height = 512;
//   const ctx = canvas.getContext('2d')!;
  
//   // Golden gradient background
//   const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
//   grad.addColorStop(0, '#FFD700');
//   grad.addColorStop(0.5, '#FFA500');
//   grad.addColorStop(1, '#FF8C00');
//   ctx.fillStyle = grad;
//   ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, Math.PI * 2);
//   ctx.fill();
  
//   // Outer rim
//   ctx.strokeStyle = '#FFF2CC';
//   ctx.lineWidth = 20;
//   ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2 - 15, 0, Math.PI * 2);
//   ctx.stroke();
  
//   // Inner circle
//   ctx.strokeStyle = '#FFD700';
//   ctx.lineWidth = 8;
//   ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2 - 50, 0, Math.PI * 2);
//   ctx.stroke();
  
//   // Rupee symbol
//   ctx.fillStyle = '#2C3E50';
//   ctx.font = `bold ${canvas.width * 0.45}px "Segoe UI", "Arial"`;
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle';
//   ctx.fillText('₹', canvas.width/2, canvas.height/2);
  
//   // "INDIA" text
//   ctx.font = `bold ${canvas.width * 0.1}px "Segoe UI", "Arial"`;
//   ctx.fillStyle = '#2C3E50';
//   ctx.fillText('INDIA', canvas.width/2, canvas.height - 70);
  
//   // Decorative dots (Ashoka chakra inspired)
//   ctx.fillStyle = '#FFD966';
//   for (let i = 0; i < 36; i++) {
//     const angle = (i / 36) * Math.PI * 2;
//     const x = canvas.width/2 + Math.cos(angle) * (canvas.width/2 - 30);
//     const y = canvas.height/2 + Math.sin(angle) * (canvas.height/2 - 30);
//     ctx.beginPath();
//     ctx.arc(x, y, 6, 0, Math.PI * 2);
//     ctx.fill();
//   }
  
//   const texture = new CanvasTexture(canvas);
//   texture.needsUpdate = true;
//   return texture;
// }

// /* ---------- UTILITY: Create Indian ₹100 Note Texture (Tricolor inspired) ---------- */
// function createRupeeNoteTexture() {
//   const canvas = document.createElement('canvas');
//   canvas.width = 512;
//   canvas.height = 256;
//   const ctx = canvas.getContext('2d')!;
  
//   // Base gradient with saffron, white, green
//   const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
//   grad.addColorStop(0, '#FF9933');
//   grad.addColorStop(0.4, '#FFFFFF');
//   grad.addColorStop(0.7, '#138808');
//   grad.addColorStop(1, '#FF9933');
//   ctx.fillStyle = grad;
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
  
//   // Border
//   ctx.strokeStyle = '#F4C542';
//   ctx.lineWidth = 8;
//   ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  
//   // Large Rupee symbol
//   ctx.fillStyle = '#1E3A5F';
//   ctx.font = `bold ${canvas.height * 0.45}px "Segoe UI", "Arial"`;
//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle';
//   ctx.fillText('₹', canvas.width/2, canvas.height/2);
  
//   // "RESERVE BANK OF INDIA"
//   ctx.font = `bold ${canvas.height * 0.1}px "Segoe UI", "Arial"`;
//   ctx.fillStyle = '#2C3E50';
//   ctx.fillText('RESERVE BANK OF INDIA', canvas.width/2, canvas.height - 30);
  
//   // Ashoka chakra symbol
//   ctx.fillStyle = '#2C3E50';
//   ctx.font = `${canvas.height * 0.2}px "Segoe UI"`;
//   ctx.fillText('🕉', 40, canvas.height/2);
//   ctx.fillText('🕉', canvas.width - 50, canvas.height/2);
  
//   const texture = new CanvasTexture(canvas);
//   texture.needsUpdate = true;
//   return texture;
// }

// /* ---------- COMPONENT: Falling Coin (with drift and reset) ---------- */
// function FallingCoin({ startPos, onCollect }: { startPos: Vector3; onCollect: (value: number) => void }) {
//   const ref = useRef<Mesh>(null);
//   const velocity = useRef(1.2 + Math.random() * 2.2);
//   const driftX = useRef((Math.random() - 0.5) * 1.5);
//   const driftZ = useRef((Math.random() - 0.5) * 1.5);
//   const rotationSpeed = useRef({
//     x: (Math.random() - 0.5) * 3,
//     y: (Math.random() - 0.5) * 3,
//     z: (Math.random() - 0.5) * 2,
//   });
//   const coinValue = 10;
//   const coinTexture = useMemo(() => createRupeeCoinTexture(), []);
//   const geometry = useMemo(() => new CylinderGeometry(0.3, 0.3, 0.06, 48), []);
  
//   useFrame((_, delta) => {
//     if (!ref.current) return;
    
//     ref.current.position.y -= velocity.current * delta;
//     ref.current.position.x += driftX.current * delta;
//     ref.current.position.z += driftZ.current * delta;
//     ref.current.rotation.x += rotationSpeed.current.x * delta;
//     ref.current.rotation.y += rotationSpeed.current.y * delta;
//     ref.current.rotation.z += rotationSpeed.current.z * delta;
    
//     // Collection zone: piggy bank slot area (approx center, y < -2.5, x in [-1.2,1.2], z in [-1.2,1.2])
//     if (
//       ref.current.position.y < -2.5 &&
//       Math.abs(ref.current.position.x) < 1.3 &&
//       Math.abs(ref.current.position.z) < 1.3
//     ) {
//       onCollect(coinValue);
//       resetCoin();
//     }
    
//     // Reset if falls below ground
//     if (ref.current.position.y < -5) resetCoin();
//   });
  
//   const resetCoin = () => {
//     if (!ref.current) return;
//     ref.current.position.x = (Math.random() - 0.5) * 8;
//     ref.current.position.z = (Math.random() - 0.5) * 6;
//     ref.current.position.y = 5 + Math.random() * 3;
//     velocity.current = 1.2 + Math.random() * 2.2;
//     driftX.current = (Math.random() - 0.5) * 1.5;
//     driftZ.current = (Math.random() - 0.5) * 1.5;
//   };
  
//   return (
//     <mesh ref={ref} position={startPos} geometry={geometry} castShadow receiveShadow>
//       <meshStandardMaterial map={coinTexture} metalness={0.85} roughness={0.25} emissive="#442200" emissiveIntensity={0.1} />
//     </mesh>
//   );
// }

// /* ---------- COMPONENT: Falling Note (with flutter) ---------- */
// function FallingNote({ startPos, onCollect }: { startPos: Vector3; onCollect: (value: number) => void }) {
//   const ref = useRef<Mesh>(null);
//   const velocity = useRef(0.7 + Math.random() * 1.5);
//   const flutterSpeed = useRef(Math.random() * 2);
//   const noteValue = 100;
//   const noteTexture = useMemo(() => createRupeeNoteTexture(), []);
//   const geometry = useMemo(() => new PlaneGeometry(0.85, 0.42), []);
  
//   useFrame(({ clock }, delta) => {
//     if (!ref.current) return;
    
//     ref.current.position.y -= velocity.current * delta;
//     const t = clock.getElapsedTime() * flutterSpeed.current;
//     ref.current.rotation.z = Math.sin(t) * 0.6;
//     ref.current.rotation.x = Math.sin(t * 1.3) * 0.4;
    
//     // Collection check
//     if (
//       ref.current.position.y < -2.5 &&
//       Math.abs(ref.current.position.x) < 1.3 &&
//       Math.abs(ref.current.position.z) < 1.3
//     ) {
//       onCollect(noteValue);
//       resetNote();
//     }
    
//     if (ref.current.position.y < -5) resetNote();
//   });
  
//   const resetNote = () => {
//     if (!ref.current) return;
//     ref.current.position.x = (Math.random() - 0.5) * 8;
//     ref.current.position.z = (Math.random() - 0.5) * 6;
//     ref.current.position.y = 5 + Math.random() * 3;
//     velocity.current = 0.7 + Math.random() * 1.5;
//     flutterSpeed.current = Math.random() * 2;
//   };
  
//   return (
//     <mesh ref={ref} position={startPos} geometry={geometry} castShadow>
//       <meshStandardMaterial map={noteTexture} side={2} metalness={0.05} roughness={0.4} transparent opacity={0.95} />
//     </mesh>
//   );
// }

// /* ---------- COMPONENT: MLM Network Nodes (Orbiting around piggy) ---------- */
// function MLMNetworkOrbit() {
//   const nodesRef = useRef<Group>(null);
//   const members = 10;
//   const positions = useMemo(() => {
//     const points = [];
//     for (let i = 0; i < members; i++) {
//       const angle = (i / members) * Math.PI * 2;
//       const radius = 1.9;
//       const yOffset = Math.sin(angle * 2) * 0.4;
//       points.push(new Vector3(Math.cos(angle) * radius, -2.1 + yOffset, Math.sin(angle) * radius));
//     }
//     return points;
//   }, []);
  
//   useFrame(({ clock }) => {
//     if (nodesRef.current) {
//       nodesRef.current.rotation.y = clock.getElapsedTime() * 0.15;
//     }
//   });
  
//   return (
//     <group ref={nodesRef}>
//       {positions.map((pos, idx) => (
//         <group key={idx} position={pos}>
//           <Sphere args={[0.12, 24, 24]}>
//             <meshStandardMaterial color="#FFB347" emissive="#FF8C00" emissiveIntensity={0.4} metalness={0.7} />
//           </Sphere>
//           <Line
//             points={[new Vector3(0, 0, 0), new Vector3(0, -0.7, 0)]}
//             color="#FFD966"
//             lineWidth={1}
//             transparent
//             opacity={0.5}
//           />
//         </group>
//       ))}
//       {positions.map((pos) => (
//         <Line
//           key={`line-${pos.x}`}
//           points={[pos, new Vector3(0, -2.2, 0)]}
//           color="#FFAA33"
//           lineWidth={0.8}
//           transparent
//           opacity={0.3}
//         />
//       ))}
//     </group>
//   );
// }

// /* ---------- COMPONENT: Piggy Bank (with glowing slot and collection effect) ---------- */
// function PiggyBank({ onCollectGlow, rankColor }: { onCollectGlow: boolean; rankColor: string }) {
//   const groupRef = useRef<Group>(null);
//   const [glowIntensity, setGlowIntensity] = useState(0);
  
//   useEffect(() => {
//     if (onCollectGlow) {
//       setGlowIntensity(0.9);
//       const timer = setTimeout(() => setGlowIntensity(0), 250);
//       return () => clearTimeout(timer);
//     }
//   }, [onCollectGlow]);
  
//   useFrame((_, delta) => {
//     if (groupRef.current) {
//       groupRef.current.rotation.y += delta * 0.5;
//     }
//   });
  
//   return (
//     <group ref={groupRef} position={[0, -3.2, 0]}>
//       {/* Body */}
//       <mesh castShadow receiveShadow>
//         <sphereGeometry args={[1.0, 64, 64]} />
//         <meshStandardMaterial color={rankColor} roughness={0.2} metalness={0.7} emissive="#FF8866" emissiveIntensity={glowIntensity * 0.5} />
//       </mesh>
//       {/* Nose */}
//       <mesh position={[0, -0.2, 1.02]} castShadow>
//         <sphereGeometry args={[0.35, 32, 32]} />
//         <meshStandardMaterial color="#F9A8D4" />
//       </mesh>
//       {/* Ears */}
//       <mesh position={[-0.55, 0.85, 0]} castShadow>
//         <coneGeometry args={[0.25, 0.5, 24]} />
//         <meshStandardMaterial color="#F472B6" />
//       </mesh>
//       <mesh position={[0.55, 0.85, 0]} castShadow>
//         <coneGeometry args={[0.25, 0.5, 24]} />
//         <meshStandardMaterial color="#F472B6" />
//       </mesh>
//       {/* Coin slot (glowing) */}
//       <mesh position={[0, 1.08, 0.12]}>
//         <boxGeometry args={[0.7, 0.08, 0.25]} />
//         <meshStandardMaterial color={onCollectGlow ? "#FFD700" : "#2C3E50"} emissive="#FFAA44" emissiveIntensity={onCollectGlow ? 1.0 : 0.25} metalness={0.9} />
//       </mesh>
//       {/* Cute eyes */}
//       <mesh position={[-0.35, 0.35, 1.05]}>
//         <sphereGeometry args={[0.08, 24, 24]} />
//         <meshStandardMaterial color="white" />
//       </mesh>
//       <mesh position={[0.35, 0.35, 1.05]}>
//         <sphereGeometry args={[0.08, 24, 24]} />
//         <meshStandardMaterial color="white" />
//       </mesh>
//       <mesh position={[-0.35, 0.32, 1.12]}>
//         <sphereGeometry args={[0.04, 24, 24]} />
//         <meshStandardMaterial color="black" />
//       </mesh>
//       <mesh position={[0.35, 0.32, 1.12]}>
//         <sphereGeometry args={[0.04, 24, 24]} />
//         <meshStandardMaterial color="black" />
//       </mesh>
//       {/* Sparkles on collect */}
//       {onCollectGlow && (
//         <Sparkles count={40} speed={0.8} size={0.1} color="#FBBF24" position={[0, 0.8, 0.6]} />
//       )}
//     </group>
//   );
// }

// /* ---------- MAIN 3D SCENE ---------- */
// function MoneyRainMLMScene({ onCollect, rankColor }: { onCollect: (value: number) => void; rankColor: string }) {
//   const coinsCount = 55;
//   const notesCount = 25;
//   const coinStarts = useMemo(
//     () => Array.from({ length: coinsCount }, () => new Vector3((Math.random() - 0.5) * 9, 2 + Math.random() * 5, (Math.random() - 0.5) * 7)),
//     []
//   );
//   const noteStarts = useMemo(
//     () => Array.from({ length: notesCount }, () => new Vector3((Math.random() - 0.5) * 9, 2 + Math.random() * 5, (Math.random() - 0.5) * 7)),
//     []
//   );
  
//   const [collectPulse, setCollectPulse] = useState(false);
  
//   const handleCollectWrapper = (value: number) => {
//     onCollect(value);
//     setCollectPulse(true);
//     setTimeout(() => setCollectPulse(false), 200);
//   };
  
//   return (
//     <Canvas
//       camera={{ position: [0, 1.2, 8], fov: 48 }}
//       shadows
//       gl={{ antialias: true, alpha: false }}
//       style={{ background: 'black' }}
//     >
//       {/* Pure black background via environment and clear color */}
//       <color attach="background" args={['black']} />
//       <ambientLight intensity={0.4} />
//       <directionalLight position={[5, 8, 4]} intensity={1.2} castShadow shadow-mapSize={1024} />
//       <pointLight position={[-3, 4, 3]} intensity={0.6} color="#FFB347" />
//       <pointLight position={[3, 5, 3]} intensity={0.5} color="#FFD966" />
      
//       {/* Subtle stars for depth */}
//       <Stars radius={40} depth={60} count={1500} factor={4} saturation={0} fade speed={0.3} />
      
//       {/* Falling objects */}
//       {coinStarts.map((pos, i) => (
//         <FallingCoin key={`coin-${i}`} startPos={pos} onCollect={handleCollectWrapper} />
//       ))}
//       {noteStarts.map((pos, i) => (
//         <FallingNote key={`note-${i}`} startPos={pos} onCollect={handleCollectWrapper} />
//       ))}
      
//       {/* MLM Network Visualization */}
//       <MLMNetworkOrbit />
      
//       {/* Piggy Bank */}
//       <PiggyBank onCollectGlow={collectPulse} rankColor={rankColor} />
      
//       {/* Floating Title */}
//       <Float speed={1.5} floatIntensity={0.6}>
//         <Text
//           position={[0, 2.5, 0]}
//           fontSize={0.55}
//           color="#FFD966"
//           anchorX="center"
//           anchorY="middle"
//           outlineWidth={0.02}
//           outlineColor="#000000"
//         >
//           💰 MLM WEALTH FLOW
//         </Text>
//       </Float>
      
//       {/* Ambient particles */}
//       <Sparkles count={600} speed={0.4} size={0.05} color="#FFA500" opacity={0.4} />
      
//       {/* Environment (subtle reflections) */}
//       <Environment preset="night" background={false} />
      
//       {/* Camera controls */}
//       <OrbitControls enableZoom={false} enablePan={true} autoRotate autoRotateSpeed={0.6} />
//     </Canvas>
//   );
// }

// /* ---------- HERO COMPONENT WITH MLM STATS PANEL ---------- */
// export default function Hero3D() {
//   const [totalCollected, setTotalCollected] = useState(0);
//   const [sessionEarned, setSessionEarned] = useState(0);
//   const [referrals, setReferrals] = useState(5);
//   const [teamSize, setTeamSize] = useState(12);
//   const [rank, setRank] = useState("Bronze");
//   const [rankColor, setRankColor] = useState("#CD7F32");
//   const [multiplier, setMultiplier] = useState(1);
//   const [toastMessage, setToastMessage] = useState("");
  
//   // Rank definitions for MLM gamification
//   const rankThresholds = [
//     { name: "Bronze", threshold: 0, multiplier: 1, color: "#CD7F32" },
//     { name: "Silver", threshold: 1500, multiplier: 1.5, color: "#C0C0C0" },
//     { name: "Gold", threshold: 4500, multiplier: 2.2, color: "#FFD700" },
//     { name: "Platinum", threshold: 10000, multiplier: 3.0, color: "#E5E4E2" },
//     { name: "Diamond", threshold: 20000, multiplier: 4.5, color: "#B9F2FF" },
//     { name: "Crown", threshold: 40000, multiplier: 6.0, color: "#FFB347" }
//   ];
  
//   const updateRank = useCallback((amount: number) => {
//     let currentRank = rankThresholds[0];
//     for (let i = rankThresholds.length - 1; i >= 0; i--) {
//       if (amount >= rankThresholds[i].threshold) {
//         currentRank = rankThresholds[i];
//         break;
//       }
//     }
//     setRank(currentRank.name);
//     setRankColor(currentRank.color);
//     setMultiplier(currentRank.multiplier);
    
//     // Simulate MLM team growth based on earnings
//     const newReferrals = Math.min(99, 5 + Math.floor(amount / 800));
//     const newTeam = Math.min(150, 12 + Math.floor(amount / 350));
//     setReferrals(newReferrals);
//     setTeamSize(newTeam);
//   }, []);
  
//   useEffect(() => {
//     updateRank(totalCollected);
//   }, [totalCollected, updateRank]);
  
//   const handleCollect = (value: number) => {
//     const finalValue = Math.floor(value * multiplier);
//     setTotalCollected(prev => prev + finalValue);
//     setSessionEarned(prev => prev + finalValue);
    
//     // Random bonus for team building (MLM context)
//     if (Math.random() < 0.1) {
//       const bonus = Math.floor(finalValue * 0.4);
//       setTotalCollected(prev => prev + bonus);
//       setToastMessage(`🎉 Team Bonus! +₹${bonus} from downline!`);
//       setTimeout(() => setToastMessage(""), 1800);
//     } else {
//       setToastMessage(`+₹${finalValue} collected!`);
//       setTimeout(() => setToastMessage(""), 1200);
//     }
//   };
  
//   const nextRank = () => {
//     const idx = rankThresholds.findIndex(r => r.name === rank);
//     if (idx + 1 < rankThresholds.length) return rankThresholds[idx + 1];
//     return rankThresholds[rankThresholds.length - 1];
//   };
  
//   const currentThreshold = rankThresholds.find(r => r.name === rank)?.threshold || 0;
//   const nextThreshold = nextRank().threshold;
//   const progressPercent = totalCollected >= nextThreshold ? 100 : ((totalCollected - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  
//   const inviteFriend = () => {
//     setToastMessage("🔗 Referral link copied! Earn 10% from direct referrals!");
//     setTimeout(() => setToastMessage(""), 2000);
//     // Simulate referral addition
//     setReferrals(prev => prev + 1);
//     setTeamSize(prev => prev + 2);
//     setTotalCollected(prev => prev + 300);
//   };
  
//   return (
//     <div className="relative h-screen w-full overflow-hidden bg-black">
//       {/* 3D Canvas with black background */}
//       <div className="absolute inset-0 z-0">
//         <MoneyRainMLMScene onCollect={handleCollect} rankColor={rankColor} />
//       </div>
      
    
//     </div>
//   );
// }