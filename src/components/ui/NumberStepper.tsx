'use client';

interface NumberStepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}

export default function NumberStepper({ label, value, min, max, step, unit, onChange }: NumberStepperProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-gray-700 min-w-[80px]">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center
                     text-gray-600 hover:bg-gray-100 hover:border-gray-400
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <svg width="12" height="2" viewBox="0 0 12 2" fill="currentColor">
            <rect width="12" height="2" rx="1" />
          </svg>
        </button>
        <span className="w-20 text-center font-semibold text-base tabular-nums">
          {value}
          {unit && <span className="text-xs font-normal text-gray-400 ml-1">{unit}</span>}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center
                     text-gray-600 hover:bg-gray-100 hover:border-gray-400
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="5" width="2" height="12" rx="1" />
            <rect y="5" width="12" height="2" rx="1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
