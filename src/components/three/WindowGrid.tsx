'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { useShallow } from 'zustand/react/shallow';
import { calcWindowPositions } from '@/lib/geometry';
import WindowSection from './WindowSection';

export default function WindowGrid() {
  const { panelWidths, sidewallWidth, height, parapet, colors, options } = useConfigStore(useShallow((s) => ({
    panelWidths: s.panelWidths,
    sidewallWidth: s.sidewallWidth,
    height: s.height,
    parapet: s.parapet,
    colors: s.colors,
    options: s.options,
  })));

  const windows = calcWindowPositions(panelWidths, sidewallWidth);

  return (
    <group>
      {windows.map((w, i) => (
        <WindowSection
          key={`window-${i}`}
          xPosition={w.x}
          frameWidthCm={w.width}
          dormerHeightCm={height}
          parapetCm={parapet}
          frameColor={colors.frame}
          windowColor={colors.window}
          hasShutters={options.rollerShutters}
          hasTiltTurn={true}
        />
      ))}

    </group>
  );
}
