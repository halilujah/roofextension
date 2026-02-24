'use client';

import * as THREE from 'three';
import { cmToM } from '@/lib/geometry';

interface WindowSectionProps {
  xPosition: number;
  frameWidthCm: number;
  dormerHeightCm: number;
  parapetCm: number;
  frameColor: string;
  windowColor: string;
  hasShutters: boolean;
  hasTiltTurn: boolean;
}

export default function WindowSection({
  xPosition,
  frameWidthCm,
  dormerHeightCm,
  parapetCm,
  frameColor,
  windowColor,
  hasShutters,
  hasTiltTurn,
}: WindowSectionProps) {
  const frameThickness = 0.045;
  const widthM = cmToM(frameWidthCm) * 0.85;
  const dormerH = cmToM(dormerHeightCm);
  const windowTop = dormerH * 0.88;
  const windowBottom = cmToM(parapetCm) + 0.05;
  const windowH = windowTop - windowBottom;
  const yCenter = (windowTop + windowBottom) / 2;
  const zOffset = 0.005;

  // Two panes: left and right, split by center mullion
  const mullionW = frameThickness * 0.8;
  const paneW = (widthM - mullionW) / 2;

  // Sash profile thickness (only used on tilt-turn pane)
  const sashThick = 0.026;

  return (
    <group position={[xPosition, yCenter, zOffset]}>
      {/* ── Outer frame (frameColor) ── */}
      {/* Top */}
      <mesh position={[0, windowH / 2 + frameThickness / 2, 0]} castShadow>
        <boxGeometry args={[widthM + frameThickness * 2, frameThickness, 0.038]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -windowH / 2 - frameThickness / 2, 0]} castShadow>
        <boxGeometry args={[widthM + frameThickness * 2, frameThickness, 0.038]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Left */}
      <mesh position={[-widthM / 2 - frameThickness / 2, 0, 0]} castShadow>
        <boxGeometry args={[frameThickness, windowH + frameThickness * 2, 0.038]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Right */}
      <mesh position={[widthM / 2 + frameThickness / 2, 0, 0]} castShadow>
        <boxGeometry args={[frameThickness, windowH + frameThickness * 2, 0.038]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* ── Center mullion (frameColor) ── */}
      <mesh castShadow>
        <boxGeometry args={[mullionW, windowH, 0.035]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* ── LEFT PANE ── */}
      <group position={[-(paneW + mullionW) / 2, 0, 0]}>
        {/* Glass */}
        <mesh>
          <planeGeometry args={[paneW, windowH]} />
          <meshPhysicalMaterial
            color="#88BBDD"
            transparent
            opacity={0.35}
            roughness={0.05}
            metalness={0.1}
            envMapIntensity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Tilt-turn sash profile + handle — only on first window's left pane */}
        {hasTiltTurn && (
          <>
            {/* Sash profile (windowColor) */}
            <mesh position={[0, windowH / 2 - sashThick / 2, 0.002]}>
              <boxGeometry args={[paneW, sashThick, 0.02]} />
              <meshStandardMaterial color={windowColor} roughness={0.3} metalness={0.05} />
            </mesh>
            <mesh position={[0, -windowH / 2 + sashThick / 2, 0.002]}>
              <boxGeometry args={[paneW, sashThick, 0.02]} />
              <meshStandardMaterial color={windowColor} roughness={0.3} metalness={0.05} />
            </mesh>
            <mesh position={[-paneW / 2 + sashThick / 2, 0, 0.002]}>
              <boxGeometry args={[sashThick, windowH, 0.02]} />
              <meshStandardMaterial color={windowColor} roughness={0.3} metalness={0.05} />
            </mesh>
            <mesh position={[paneW / 2 - sashThick / 2, 0, 0.002]}>
              <boxGeometry args={[sashThick, windowH, 0.02]} />
              <meshStandardMaterial color={windowColor} roughness={0.3} metalness={0.05} />
            </mesh>
            {/* Handle */}
            <mesh position={[paneW / 2 - sashThick - 0.01, 0, 0.012]}>
              <boxGeometry args={[0.012, 0.08, 0.014]} />
              <meshStandardMaterial color="#999" roughness={0.4} metalness={0.4} />
            </mesh>
          </>
        )}
      </group>

      {/* ── RIGHT PANE (always fixed) ── */}
      <group position={[(paneW + mullionW) / 2, 0, 0]}>
        {/* Glass */}
        <mesh>
          <planeGeometry args={[paneW, windowH]} />
          <meshPhysicalMaterial
            color="#88BBDD"
            transparent
            opacity={0.35}
            roughness={0.05}
            metalness={0.1}
            envMapIntensity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Roller shutters (if enabled) */}
      {hasShutters && (
        <mesh position={[0, windowH / 2 + frameThickness + 0.04, 0.015]}>
          <boxGeometry args={[widthM + frameThickness * 2 + 0.02, 0.07, 0.06]} />
          <meshStandardMaterial color="#666" roughness={0.6} metalness={0.3} />
        </mesh>
      )}
    </group>
  );
}
