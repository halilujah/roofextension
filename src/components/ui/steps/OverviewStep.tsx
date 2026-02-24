'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { useShallow } from 'zustand/react/shallow';
import { calculatePrice } from '@/lib/pricing';

export default function OverviewStep() {
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

  const price = calculatePrice(state as any);
  const windowCount = state.panelCount + 1;
  const totalWidth = state.panelWidths.reduce(
    (sum, p) => sum + p.frameWidth + p.penantWidth, 0
  ) + 2 * state.sidewallWidth;

  return (
    <div className="px-4 py-3">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Configuration Summary</h3>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between py-1.5 border-b border-gray-100">
          <span className="text-gray-500">Dormer Type</span>
          <span className="font-medium text-gray-800 capitalize">{state.dormerType}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-gray-100">
          <span className="text-gray-500">Slope Angle</span>
          <span className="font-medium text-gray-800">{state.slopeAngle}{"\u00B0"}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-gray-100">
          <span className="text-gray-500">Height / Parapet</span>
          <span className="font-medium text-gray-800">{state.height} cm / {state.parapet} cm</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-gray-100">
          <span className="text-gray-500">Windows</span>
          <span className="font-medium text-gray-800">{windowCount} sections</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-gray-100">
          <span className="text-gray-500">Total Width</span>
          <span className="font-medium text-gray-800">{totalWidth} cm</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-gray-100">
          <span className="text-gray-500">Side Material</span>
          <span className="font-medium text-gray-800 uppercase">{state.sideMaterial}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-gray-100">
          <span className="text-gray-500">Position</span>
          <span className="font-medium text-gray-800 capitalize">{state.position}</span>
        </div>
        {state.options.rollerShutters && (
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500">Roller Shutters</span>
            <span className="font-medium text-green-600">Included</span>
          </div>
        )}
        {state.options.insectScreens && (
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500">Insect Screens</span>
            <span className="font-medium text-green-600">Included</span>
          </div>
        )}
        {state.options.ventilationGrilles && (
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500">Ventilation Grilles</span>
            <span className="font-medium text-green-600">Included</span>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="mt-4 pt-3 border-t-2 border-gray-200">
        <h4 className="text-xs font-semibold text-gray-600 mb-2">Price Breakdown</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Base price</span>
            <span>{"\u20AC"} {price.basePrice.toLocaleString('nl-NL')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Dimensions</span>
            <span>{"\u20AC"} {price.dimensionPrice.toLocaleString('nl-NL')}</span>
          </div>
          {price.panelSurcharge > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Panel surcharge</span>
              <span>{"\u20AC"} {price.panelSurcharge.toLocaleString('nl-NL')}</span>
            </div>
          )}
          {price.materialSurcharge > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Material upgrade</span>
              <span>{"\u20AC"} {price.materialSurcharge.toLocaleString('nl-NL')}</span>
            </div>
          )}
          {price.optionsPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Options</span>
              <span>{"\u20AC"} {price.optionsPrice.toLocaleString('nl-NL')}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-sm text-gray-900">
            <span>Total</span>
            <span>{"\u20AC"} {price.total.toLocaleString('nl-NL')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
