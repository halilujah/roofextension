'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { useShallow } from 'zustand/react/shallow';
import { DormerPosition } from '@/types/configurator';
import OptionToggle from '../OptionToggle';
import MaterialCard from '../MaterialCard';

export default function OptionsStep() {
  const { options, setOption, position, setPosition } = useConfigStore(useShallow((s) => ({
    options: s.options,
    setOption: s.setOption,
    position: s.position,
    setPosition: s.setPosition,
  })));

  const positions: { value: DormerPosition; label: string; desc: string }[] = [
    { value: 'front', label: 'Front', desc: 'Most common placement, facing the street' },
    { value: 'back', label: 'Back', desc: 'Facing the garden or backyard' },
    { value: 'left', label: 'Left Side', desc: 'On the left side of the roof' },
    { value: 'right', label: 'Right Side', desc: 'On the right side of the roof' },
  ];

  return (
    <div className="px-4 py-3 space-y-4">
      {/* Additional Options */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Additional Options</h3>
        <OptionToggle
          title="Roller Shutters"
          description="Block UV in summer and provide extra insulation in winter"
          checked={options.rollerShutters}
          onChange={(v) => setOption('rollerShutters', v)}
        />
        <OptionToggle
          title="Insect Screens"
          description="Let fresh air in while keeping insects and pollen out"
          checked={options.insectScreens}
          onChange={(v) => setOption('insectScreens', v)}
        />
        <OptionToggle
          title="Ventilation Grilles"
          description="Ensure healthy air circulation without draughts"
          checked={options.ventilationGrilles}
          onChange={(v) => setOption('ventilationGrilles', v)}
        />
      </div>

      {/* Position */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Dormer Position</h3>
        {positions.map((p) => (
          <MaterialCard
            key={p.value}
            title={p.label}
            description={p.desc}
            selected={position === p.value}
            onClick={() => setPosition(p.value)}
          />
        ))}
      </div>
    </div>
  );
}
