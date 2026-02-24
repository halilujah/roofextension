'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { VizMode } from '@/types/configurator';

const VIZ_MODES: { key: VizMode; label: string; title: string }[] = [
  { key: 'realistic', label: 'Realistic', title: 'Photorealistic with PBR materials, reflections and shadows' },
  { key: 'shaded', label: 'Shaded', title: 'Solid geometry with basic lighting, no textures' },
  { key: 'shadedEdges', label: 'Edges', title: 'Shaded surfaces with visible edge outlines' },
  { key: 'textured', label: 'Textured', title: 'Applied materials without full photorealistic lighting' },
];

export default function VizModeSelector() {
  const vizMode = useConfigStore((s) => s.vizMode);
  const setVizMode = useConfigStore((s) => s.setVizMode);

  return (
    <div className="absolute bottom-3 left-3 z-10 flex gap-1">
      {VIZ_MODES.map((mode) => (
        <button
          key={mode.key}
          onClick={() => setVizMode(mode.key)}
          title={mode.title}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all
            ${vizMode === mode.key
              ? 'bg-white text-gray-900 shadow-md border border-gray-300'
              : 'bg-white/60 text-gray-600 hover:bg-white/90 hover:text-gray-800 border border-transparent'
            }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
