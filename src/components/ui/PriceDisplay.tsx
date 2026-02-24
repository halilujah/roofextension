'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { useShallow } from 'zustand/react/shallow';
import { calculatePrice } from '@/lib/pricing';

export default function PriceDisplay() {
  const state = useConfigStore(useShallow((s) => ({
    dormerType: s.dormerType,
    slopeAngle: s.slopeAngle,
    height: s.height,
    parapet: s.parapet,
    panelCount: s.panelCount,
    panelWidths: s.panelWidths,
    sidewallWidth: s.sidewallWidth,
    sideMaterial: s.sideMaterial,
    colors: s.colors,
    options: s.options,
    position: s.position,
    currentStep: s.currentStep,
  })));
  const { total } = calculatePrice(state as any);

  return (
    <div className="text-center">
      <span className="text-[10px] uppercase tracking-wide text-gray-400 block">Estimated</span>
      <span className="text-lg font-bold text-gray-900 tabular-nums">
        {"\u20AC"} {total.toLocaleString('nl-NL')}
      </span>
    </div>
  );
}
