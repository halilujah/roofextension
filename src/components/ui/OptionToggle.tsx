'use client';

interface OptionToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function OptionToggle({ title, description, checked, onChange }: OptionToggleProps) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 mb-2 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onChange(!checked)}
    >
      <div className="pt-0.5 flex-shrink-0">
        <div
          className={`w-10 h-5 rounded-full transition-colors relative
            ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform
              ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
          />
        </div>
      </div>
      <div className="flex-1">
        <span className="text-sm font-semibold text-gray-800 block">{title}</span>
        <span className="text-xs text-gray-500 block mt-0.5">{description}</span>
      </div>
    </div>
  );
}
