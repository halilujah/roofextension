'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { useShallow } from 'zustand/react/shallow';
import { CONSTRAINTS } from '@/lib/constants';
import NumberStepper from '../NumberStepper';

export default function RoofAngleStep() {
  const { slopeAngle, setSlopeAngle } = useConfigStore(useShallow((s) => ({
    slopeAngle: s.slopeAngle,
    setSlopeAngle: s.setSlopeAngle,
  })));

  return (
    <div className="px-4 py-3">
      <h3 className="text-sm font-semibold text-gray-800 mb-1">Slope Angle</h3>
      <p className="text-xs text-gray-500 mb-3">
        How sloped is your roof? This affects the dormer depth and side panel geometry.
      </p>

      <NumberStepper
        label="Angle"
        value={slopeAngle}
        unit={"\u00B0"}
        onChange={setSlopeAngle}
        {...CONSTRAINTS.slopeAngle}
      />

      {/* Visual angle indicator */}
      <div className="mt-4 flex items-end justify-center h-20">
        <svg width="160" height="80" viewBox="0 0 160 80">
          {/* Roof slope line */}
          <line
            x1="10"
            y1="75"
            x2={10 + 140 * Math.cos((slopeAngle * Math.PI) / 180)}
            y2={75 - 140 * Math.sin((slopeAngle * Math.PI) / 180)}
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Horizontal baseline */}
          <line x1="10" y1="75" x2="150" y2="75" stroke="#d1d5db" strokeWidth="1.5" />
          {/* Angle arc */}
          <path
            d={`M 40 75 A 30 30 0 0 1 ${10 + 30 * Math.cos((slopeAngle * Math.PI) / 180)} ${75 - 30 * Math.sin((slopeAngle * Math.PI) / 180)}`}
            fill="none"
            stroke="#93c5fd"
            strokeWidth="1.5"
          />
          <text
            x="50"
            y="68"
            fill="#3b82f6"
            fontSize="12"
            fontWeight="600"
          >
            {slopeAngle}{"\u00B0"}
          </text>
        </svg>
      </div>
    </div>
  );
}
