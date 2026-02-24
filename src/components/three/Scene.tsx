'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';
import { useConfigStore } from '@/store/useConfigStore';
import DormerModel from './DormerModel';
import RoofBase from './RoofBase';
import CameraController from './CameraController';
import EdgeOverlay from './EdgeOverlay';

function SceneContent() {
  const vizMode = useConfigStore((s) => s.vizMode);
  const showEnvironment = vizMode === 'realistic';
  const showEdges = vizMode === 'shadedEdges';

  return (
    <>
      <color attach="background" args={['#e8ecf0']} />
      <fog attach="fog" args={['#e8ecf0', 18, 40]} />

      <ambientLight intensity={vizMode === 'realistic' ? 0.5 : 0.7} />
      <directionalLight
        position={[5, 8, 3]}
        intensity={vizMode === 'realistic' ? 1.5 : 1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={25}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} />

      <Suspense fallback={null}>
        {showEnvironment && <Environment preset="city" background={false} />}
        <DormerModel />
        <RoofBase />
      </Suspense>

      {showEdges && <EdgeOverlay />}

      <CameraController />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={15}
        minPolarAngle={0.05}
        maxPolarAngle={Math.PI * 0.85}
        makeDefault
      />
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [4, 3.5, 7], fov: 45 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <SceneContent />
    </Canvas>
  );
}
