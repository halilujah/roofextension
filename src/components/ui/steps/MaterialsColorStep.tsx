'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { useShallow } from 'zustand/react/shallow';
import { COLOR_PALETTES } from '@/lib/constants';
import MaterialCard from '../MaterialCard';
import ColorPicker from '../ColorPicker';

export default function MaterialsColorStep() {
  const { sideMaterial, setSideMaterial, colors, setColor } = useConfigStore(useShallow((s) => ({
    sideMaterial: s.sideMaterial,
    setSideMaterial: s.setSideMaterial,
    colors: s.colors,
    setColor: s.setColor,
  })));

  return (
    <div className="px-4 py-3 space-y-4">
      {/* Side Material */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Side Panel Material</h3>
        <MaterialCard
          title="Vinyplus Round Edge"
          description="UV-resistant, low maintenance vinyl siding with rounded edge profile"
          selected={sideMaterial === 'vinyplus'}
          onClick={() => setSideMaterial('vinyplus')}
        />
        <MaterialCard
          title="HPL (High Pressure Laminate)"
          description="Durable, smooth finish laminate with premium appearance"
          selected={sideMaterial === 'hpl'}
          onClick={() => setSideMaterial('hpl')}
        />
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Colors</h3>
        <ColorPicker
          label="Front and sidewalls"
          colors={COLOR_PALETTES.frontAndSides}
          selected={colors.frontAndSides}
          onChange={(c) => setColor('frontAndSides', c)}
        />
        <ColorPicker
          label="Buoy or overhang"
          colors={COLOR_PALETTES.overhang}
          selected={colors.overhang}
          onChange={(c) => setColor('overhang', c)}
        />
        <ColorPicker
          label="Frame"
          colors={COLOR_PALETTES.frame}
          selected={colors.frame}
          onChange={(c) => setColor('frame', c)}
        />
        <ColorPicker
          label="Tilt and turn window"
          colors={COLOR_PALETTES.window}
          selected={colors.window}
          onChange={(c) => setColor('window', c)}
        />
      </div>
    </div>
  );
}
