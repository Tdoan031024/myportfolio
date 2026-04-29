"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";

function Orb() {
  const meshRef = useRef<Mesh>(null);
  const color = useMemo(() => "#52f5ff", []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.35;
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
  });

  return (
    <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1.4}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.25}
          metalness={0.9}
          distort={0.4}
          speed={2.2}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 3.6], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 2]} intensity={1.2} />
      <Orb />
    </Canvas>
  );
}
