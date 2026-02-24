'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { CONSTRAINTS } from '@/lib/constants';
import NumberStepper from '../NumberStepper';

export default function DimensionsStep() {
  const dormerType = useConfigStore((s) => s.dormerType);
  const setDormerType = useConfigStore((s) => s.setDormerType);
  const height = useConfigStore((s) => s.height);
  const setHeight = useConfigStore((s) => s.setHeight);
  const parapet = useConfigStore((s) => s.parapet);
  const setParapet = useConfigStore((s) => s.setParapet);
  const panelCount = useConfigStore((s) => s.panelCount);
  const setPanelCount = useConfigStore((s) => s.setPanelCount);
  const panelWidths = useConfigStore((s) => s.panelWidths);
  const setPanelWidth = useConfigStore((s) => s.setPanelWidth);
  const sidewallWidth = useConfigStore((s) => s.sidewallWidth);

  const totalWidth = panelWidths.reduce(
    (sum, p) => sum + p.frameWidth + p.penantWidth, 0
  ) + 2 * sidewallWidth;

  return (
    <div className="px-4 py-3 space-y-4">
      {/* Dormer Type */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Dormer Type</h3>
        <div className="flex gap-2">
          {(['traditional', 'frame'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setDormerType(type)}
              className={`flex-1 p-3 rounded-lg border-2 text-center transition-all
                ${dormerType === type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className={`text-2xl mb-1 ${dormerType === type ? 'opacity-100' : 'opacity-50'}`}>
                {type === 'traditional' ? '\u25AD' : '\u25A1'}
              </div>
              <span className={`text-xs font-semibold ${dormerType === type ? 'text-blue-700' : 'text-gray-600'}`}>
                {type === 'traditional' ? 'Type 1' : 'Type 2'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Height & Parapet */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Dimensions</h3>
        <NumberStepper label="Height" value={height} unit="cm" onChange={setHeight} {...CONSTRAINTS.height} />
        <NumberStepper label="Parapet" value={parapet} unit="cm" onChange={setParapet} {...CONSTRAINTS.parapet} />
      </div>

      {/* Panel Count */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Panels</h3>
        <p className="text-xs text-gray-500 mb-1">Intermediate panels divide the dormer into sections ({panelCount + 1} windows)</p>
        <NumberStepper label="Panels" value={panelCount} onChange={setPanelCount} {...CONSTRAINTS.panelCount} />
      </div>

      {/* Per-panel widths */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Width per Section</h3>
        {panelWidths.map((panel, i) => (
          <div key={i} className="mb-1">
            <NumberStepper
              label={`Frame ${i + 1}`}
              value={panel.frameWidth}
              unit="cm"
              onChange={(v) => setPanelWidth(i, 'frameWidth', v)}
              {...CONSTRAINTS.frameWidth}
            />
            {i < panelWidths.length - 1 && (
              <NumberStepper
                label="Penant"
                value={panel.penantWidth}
                unit="cm"
                onChange={(v) => setPanelWidth(i, 'penantWidth', v)}
                {...CONSTRAINTS.penantWidth}
              />
            )}
          </div>
        ))}
        <div className="flex justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
          <span>2x sidewall: {sidewallWidth} cm</span>
          <span className="font-semibold text-gray-800">Total: {totalWidth} cm</span>
        </div>
      </div>
    </div>
  );
}
