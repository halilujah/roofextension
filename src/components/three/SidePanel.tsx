'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useConfigStore } from '@/store/useConfigStore';
import { useShallow } from 'zustand/react/shallow';
import { cmToM, calcDormerDepth, calcTotalWidth } from '@/lib/geometry';

interface SidePanelProps {
  side: 'left' | 'right';
}

export default function SidePanel({ side }: SidePanelProps) {
  const { height, slopeAngle, panelWidths, sidewallWidth, colors, sideMaterial } = useConfigStore(useShallow((s) => ({
    height: s.height,
    slopeAngle: s.slopeAngle,
    panelWidths: s.panelWidths,
    sidewallWidth: s.sidewallWidth,
    colors: s.colors,
    sideMaterial: s.sideMaterial,
  })));

  const heightM = cmToM(height);
  const depthM = calcDormerDepth(slopeAngle, height);
  const totalWidthM = calcTotalWidth(panelWidths, sidewallWidth);
  const xOffset = (side === 'left' ? -1 : 1) * totalWidthM / 2;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    // Right triangle side panel:
    //   A (0, 0, 0)              = bottom-front (on roof surface at dormer front)
    //   B (0, heightM, 0)        = top-front (top of dormer front wall)
    //   C (0, heightM, -depthM)  = top-back (where flat dormer top meets roof surface)
    //
    // The hypotenuse A→C follows the roof slope exactly since
    // depthM = heightM / tan(slopeAngle), so rise/run = heightM/depthM = tan(slopeAngle)
    const vertices = new Float32Array([
      0, 0, 0,
      0, heightM, 0,
      0, heightM, -depthM,
    ]);

    const uvs = new Float32Array([
      0, 0,
      0, 1,
      1, 1,
    ]);

    // Winding order determines outward normal direction
    const indices = side === 'left'
      ? [0, 2, 1]   // normal points -X (outward left)
      : [0, 1, 2];  // normal points +X (outward right)

    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    return geo;
  }, [heightM, depthM, side]);

  const materialProps = sideMaterial === 'hpl'
    ? { roughness: 0.3, metalness: 0.15 }
    : { roughness: 0.7, metalness: 0.05 };

  return (
    <mesh
      geometry={geometry}
      position={[xOffset, 0, 0]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={colors.frontAndSides}
        side={THREE.DoubleSide}
        {...materialProps}
      />
    </mesh>
  );
}
