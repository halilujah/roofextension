'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { useShallow } from 'zustand/react/shallow';
import { calcTotalWidth, ROOF_SETBACK } from '@/lib/geometry';
import DormerBody from './DormerBody';
import DormerRoofCap from './DormerRoofCap';
import WindowGrid from './WindowGrid';
import SidePanel from './SidePanel';

export default function DormerModel() {
  const { slopeAngle, panelWidths, sidewallWidth } = useConfigStore(useShallow((s) => ({
    slopeAngle: s.slopeAngle,
    panelWidths: s.panelWidths,
    sidewallWidth: s.sidewallWidth,
  })));

  const slopeRad = (slopeAngle * Math.PI) / 180;
  const totalWidthM = calcTotalWidth(panelWidths, sidewallWidth);

  const yOffset = ROOF_SETBACK * Math.sin(slopeRad);
  const zOffset = -ROOF_SETBACK * Math.cos(slopeRad);
  const xOffset = totalWidthM / 2;

  return (
    <group position={[xOffset, yOffset, zOffset]}>
      <DormerBody />
      <DormerRoofCap />
      <WindowGrid />
      <SidePanel side="left" />
      <SidePanel side="right" />
    </group>
  );
}
