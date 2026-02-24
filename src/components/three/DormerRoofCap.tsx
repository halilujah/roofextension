'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { useShallow } from 'zustand/react/shallow';
import { cmToM, calcDormerDepth, calcTotalWidth } from '@/lib/geometry';

export default function DormerRoofCap() {
  const { height, slopeAngle, panelWidths, sidewallWidth, colors } = useConfigStore(useShallow((s) => ({
    height: s.height,
    slopeAngle: s.slopeAngle,
    panelWidths: s.panelWidths,
    sidewallWidth: s.sidewallWidth,
    colors: s.colors,
  })));

  const heightM = cmToM(height);
  const totalWidthM = calcTotalWidth(panelWidths, sidewallWidth);
  const depthM = calcDormerDepth(slopeAngle, height);

  const capThickness = 0.05;
  const overhangFront = 0.06;
  const overhangSide = 0.04;

  // Cap extends from z = overhangFront (in front) to z = -depthM (flush with roof at back)
  const capLen = depthM + overhangFront;
  const capCenterZ = (overhangFront - depthM) / 2;

  return (
    <group>
      {/* Main roof cap */}
      <mesh
        position={[0, heightM + capThickness / 2, capCenterZ]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[
          totalWidthM + overhangSide * 2,
          capThickness,
          capLen,
        ]} />
        <meshStandardMaterial
          color={colors.overhang}
          roughness={0.5}
          metalness={0.15}
        />
      </mesh>

      {/* Front fascia (trim strip below overhang) */}
      <mesh
        position={[0, heightM - 0.02, overhangFront / 2]}
        castShadow
      >
        <boxGeometry args={[totalWidthM + overhangSide * 2, 0.06, 0.02]} />
        <meshStandardMaterial
          color={colors.overhang}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}
