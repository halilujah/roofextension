'use client';

interface ColorPickerProps {
  label: string;
  colors: string[];
  selected: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ label, colors, selected, onChange }: ColorPickerProps) {
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-gray-600 mb-1.5 block">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110
              ${selected === color
                ? 'border-blue-500 ring-2 ring-blue-200 scale-110'
                : 'border-gray-200 hover:border-gray-400'
              }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
