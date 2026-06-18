import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Sky, PointerLockControls } from "@react-three/drei";
import type { FloorplanItem } from "@/hooks/use-floorplan";

interface Props {
  items: FloorplanItem[];
  canvas: { width: number; height: number };
  walkable?: boolean;
}

// Convert 2D pixel-space coords to a centered 3D plane (meters).
const SCALE = 0.05; // 1 unit ~ 0.05 m for visual scale

function ItemMesh({ it }: { it: FloorplanItem }) {
  const color = (it.meta?.color as string) ?? "#fb923c";
  const x = (it.x + it.w / 2) * SCALE;
  const z = (it.y + it.h / 2) * SCALE;
  const w = it.w * SCALE;
  const d = it.h * SCALE;
  const heightMap: Record<string, number> = {
    booth: 2.5, table: 0.75, wall: 3, pedestal: 1.1, stage: 0.6,
    seating: 0.5, tent: 3, truck: 2.6, path: 0.02, entrance: 0.05,
    power: 0.4, signage: 2.2, misc: 1,
  };
  const h = (heightMap[it.kind] ?? 1) * (it.z / 30);

  return (
    <group position={[x, h / 2, z]} rotation={[0, (-it.rotation * Math.PI) / 180, 0]}>
      {it.kind === "tent" ? (
        <mesh>
          <coneGeometry args={[Math.max(w, d) / 1.5, h, 6]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ) : (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={color} />
        </mesh>
      )}
      {it.label && (
        <Text position={[0, h / 2 + 0.3, 0]} fontSize={0.3} color="white" anchorX="center">
          {it.label}
        </Text>
      )}
    </group>
  );
}

export const FloorplanScene3D: React.FC<Props> = ({ items, canvas, walkable }) => {
  const planeW = canvas.width * SCALE;
  const planeD = canvas.height * SCALE;

  return (
    <Canvas shadows camera={{ position: [planeW / 2, 8, planeD * 1.1], fov: 60 }}>
      <Suspense fallback={null}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[20, 30, 10]} intensity={1} castShadow />
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[planeW / 2, 0, planeD / 2]} receiveShadow>
          <planeGeometry args={[planeW, planeD]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        {items.map((it) => <ItemMesh key={it.id} it={it} />)}
        {walkable ? <PointerLockControls /> : <OrbitControls target={[planeW / 2, 0, planeD / 2]} />}
      </Suspense>
    </Canvas>
  );
};

export default FloorplanScene3D;