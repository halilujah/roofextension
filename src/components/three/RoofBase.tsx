'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useConfigStore } from '@/store/useConfigStore';
import { useShallow } from 'zustand/react/shallow';
import { cmToM, calcTotalWidth, calcDormerDepth, ROOF_SETBACK, ROOF_MARGIN } from '@/lib/geometry';

export default function RoofBase() {
  const { slopeAngle, height, panelWidths, sidewallWidth, vizMode } = useConfigStore(useShallow((s) => ({
    slopeAngle: s.slopeAngle,
    height: s.height,
    panelWidths: s.panelWidths,
    sidewallWidth: s.sidewallWidth,
    vizMode: s.vizMode,
  })));

  const slopeRad = (slopeAngle * Math.PI) / 180;
  const heightM = cmToM(height);
  const totalWidthM = calcTotalWidth(panelWidths, sidewallWidth);
  const depthM = calcDormerDepth(slopeAngle, height); // depth along Z in dormer-local space
  const depthAlongSlope = heightM / Math.sin(slopeRad); // depth along the slope surface

  const thickness = 0.15; // 15cm roof slab thickness

  // Dynamic roof sizing: roof must cover dormer + margins
  const roofWidth = totalWidthM + 2 * ROOF_MARGIN;
  const roofLength = Math.max(6, ROOF_SETBACK + depthAlongSlope + 1.5);

  // Cutout dimensions in roof-local space (the rotated frame)
  // Dormer sits at ROOF_SETBACK along the slope, with depth depthAlongSlope.
  // The dormer left edge is at x=0 in world, right edge at x=totalWidthM.
  // In roof-local space, x is the same. The roof left edge is at x = -ROOF_MARGIN (relative to roof center).
  // We'll position the roof so its left edge is at x = -ROOF_MARGIN.
  // Roof center x = totalWidthM/2 + ROOF_MARGIN - ROOF_MARGIN = totalWidthM/2
  // Actually: left edge at -ROOF_MARGIN means center = roofWidth/2 - ROOF_MARGIN = totalWidthM/2

  // Cutout in roof-local z coordinates (z=0 at gutter, -z toward ridge)
  const cutZ_front = ROOF_SETBACK;              // dormer front edge along slope
  const cutZ_back = ROOF_SETBACK + depthAlongSlope; // dormer back edge along slope
  // Cutout x: dormer occupies x = 0 to totalWidthM in world space
  // In roof-local space with roof centered at x = totalWidthM/2:
  //   dormer left edge = 0 - (totalWidthM/2) = -totalWidthM/2 relative to roof center
  //   but we position the roof mesh at x = roofWidth/2 - ROOF_MARGIN
  // Let's keep it simple: dormer x goes from -totalWidthM/2 to +totalWidthM/2 in the roof mesh local frame
  // since the roof mesh is centered at x = totalWidthM/2 in world.
  // Wait: the roof mesh center is at [roofCenterX, -thickness/2, -roofLength/2] in the group.
  // The group is at world origin with rotation. So roofCenterX sets the world x of the roof center.
  // We want roof left edge at x = -ROOF_MARGIN → center x = roofWidth/2 - ROOF_MARGIN = totalWidthM/2
  const roofCenterX = totalWidthM / 2;

  // Procedural tile texture
  const tileTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 512, 512);

    const tileW = 64;
    const tileH = 32;
    for (let row = 0; row < 512 / tileH; row++) {
      const offset = row % 2 === 0 ? 0 : tileW / 2;
      for (let col = -1; col < 512 / tileW + 1; col++) {
        const x = col * tileW + offset;
        const y = row * tileH;
        const brightness = 35 + Math.random() * 15;
        ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness + 2})`;
        ctx.fillRect(x + 1, y + 1, tileW - 2, tileH - 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.02 + Math.random() * 0.03})`;
        ctx.fillRect(x + 1, y + 1, tileW - 2, 3);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(12, 8);
    return tex;
  }, []);

  const useTexture = vizMode === 'realistic' || vizMode === 'textured';

  const edgeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#4a4540', roughness: 0.8 }), []);
  const tileMat = useMemo(() =>
    useTexture
      ? new THREE.MeshStandardMaterial({ map: tileTexture, roughness: 0.9, metalness: 0.05 })
      : new THREE.MeshStandardMaterial({ color: '#3a3a3a', roughness: 0.8 }),
    [tileTexture, useTexture]
  );
  const ceilingMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f5f0e8', roughness: 0.8 }), []);
  const gutterMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5a5550', roughness: 0.7 }), []);

  // Multi-material: [+X, -X, +Y, -Y, +Z, -Z]
  const makeMaterials = useMemo(() => () =>
    [edgeMat, edgeMat, tileMat, ceilingMat, gutterMat, edgeMat],
    [edgeMat, tileMat, ceilingMat, gutterMat]
  );

  // ── Build 4 boxes around the cutout ──
  // In roof-local (rotated) space:
  //   Z axis: 0 = gutter edge, -roofLength = ridge
  //   X axis: centered on roofCenterX in world
  //
  // Cutout in local-z: from -cutZ_front to -cutZ_back
  // Cutout in local-x: from -totalWidthM/2 to +totalWidthM/2 (relative to roof center)
  //
  // Pieces:
  // 1. FRONT strip: full width, from gutter (z=0) to dormer front (z=-cutZ_front)
  // 2. BACK strip: full width, from dormer back (z=-cutZ_back) to ridge (z=-roofLength)
  // 3. LEFT strip: ROOF_MARGIN wide, from z=-cutZ_front to z=-cutZ_back
  // 4. RIGHT strip: ROOF_MARGIN wide, from z=-cutZ_front to z=-cutZ_back

  const frontLen = cutZ_front;
  const backLen = roofLength - cutZ_back;
  const cutLen = cutZ_back - cutZ_front;

  // Positions are relative to the roof group origin (rotation applied to whole group)
  // Each mesh position is the center of the box

  return (
    <group rotation={[slopeRad, 0, 0]}>
      {/* 1. FRONT strip – full width, gutter to dormer front */}
      {frontLen > 0.01 && (
        <mesh
          position={[roofCenterX, -thickness / 2, -frontLen / 2]}
          material={makeMaterials()}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[roofWidth, thickness, frontLen]} />
        </mesh>
      )}

      {/* 2. BACK strip – full width, dormer back to ridge */}
      {backLen > 0.01 && (
        <mesh
          position={[roofCenterX, -thickness / 2, -(cutZ_back + backLen / 2)]}
          material={makeMaterials()}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[roofWidth, thickness, backLen]} />
        </mesh>
      )}

      {/* 3. LEFT strip – margin width, alongside cutout */}
      {cutLen > 0.01 && (
        <mesh
          position={[
            roofCenterX - roofWidth / 2 + ROOF_MARGIN / 2,
            -thickness / 2,
            -(cutZ_front + cutLen / 2)
          ]}
          material={makeMaterials()}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[ROOF_MARGIN, thickness, cutLen]} />
        </mesh>
      )}

      {/* 4. RIGHT strip – margin width, alongside cutout */}
      {cutLen > 0.01 && (
        <mesh
          position={[
            roofCenterX + roofWidth / 2 - ROOF_MARGIN / 2,
            -thickness / 2,
            -(cutZ_front + cutLen / 2)
          ]}
          material={makeMaterials()}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[ROOF_MARGIN, thickness, cutLen]} />
        </mesh>
      )}
    </group>
  );
}
