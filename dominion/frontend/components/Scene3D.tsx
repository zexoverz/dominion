'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Float } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.1;
      ref.current.rotation.y += delta * 0.15;
    }
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.3} wireframe transparent opacity={0.6} />
    </mesh>
  );
}

const SHAPES = [
  { geo: 'octahedron', color: '#f59e0b', radius: 4, speed: 0.3, offset: 0 },
  { geo: 'dodecahedron', color: '#8b5cf6', radius: 5, speed: 0.25, offset: 0.9 },
  { geo: 'sphere', color: '#06b6d4', radius: 3.5, speed: 0.35, offset: 1.8 },
  { geo: 'tetrahedron', color: '#ef4444', radius: 4.5, speed: 0.2, offset: 2.7 },
  { geo: 'torus', color: '#22c55e', radius: 5.5, speed: 0.28, offset: 3.6 },
  { geo: 'box', color: '#f59e0b', radius: 3.8, speed: 0.32, offset: 4.5 },
  { geo: 'cone', color: '#6366f1', radius: 4.8, speed: 0.22, offset: 5.4 },
];

function OrbitalShape({ geo, color, radius, speed, offset }: typeof SHAPES[0]) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = Math.sin(t * 0.5) * 0.8;
    ref.current.rotation.y += 0.01;
    ref.current.rotation.x += 0.005;
  });

  const geometry = useMemo(() => {
    switch (geo) {
      case 'octahedron': return <octahedronGeometry args={[0.4]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[0.4]} />;
      case 'sphere': return <sphereGeometry args={[0.35, 16, 16]} />;
      case 'tetrahedron': return <tetrahedronGeometry args={[0.4]} />;
      case 'torus': return <torusGeometry args={[0.3, 0.12, 8, 16]} />;
      case 'box': return <boxGeometry args={[0.5, 0.5, 0.5]} />;
      case 'cone': return <coneGeometry args={[0.3, 0.6, 8]} />;
      default: return <sphereGeometry args={[0.3]} />;
    }
  }, [geo]);

  return (
    <group ref={ref}>
      <mesh>
        {geometry}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} wireframe />
      </mesh>
    </group>
  );
}

function Particles() {
  const count = 300;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#00f0ff" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function SceneContent({ dimmed }: { dimmed?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#00f0ff" />
      <Float speed={1} floatIntensity={0.3}>
        <Core />
      </Float>
      {SHAPES.map((s, i) => (
        <OrbitalShape key={i} {...s} />
      ))}
      <Particles />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  );
}

export default function Scene3D({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <div
      className="fixed inset-0"
      style={{
        zIndex: 0,
        opacity: dimmed ? 0.3 : 1,
        transition: 'opacity 0.5s ease',
      }}
    >
      <Canvas
        camera={{ position: [0, 3, 10], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: '#050508' }}
      >
        <Suspense fallback={null}>
          <SceneContent dimmed={dimmed} />
        </Suspense>
      </Canvas>
    </div>
  );
}
