'use client';

interface MaterialCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export default function MaterialCard({ title, description, selected, onClick }: MaterialCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border-2 transition-all mb-2
        ${selected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
        }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
          ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
          {selected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
        </div>
        <div>
          <span className={`text-sm font-semibold block ${selected ? 'text-blue-700' : 'text-gray-800'}`}>
            {title}
          </span>
          <span className="text-xs text-gray-500 block mt-0.5">{description}</span>
        </div>
      </div>
    </button>
  );
}
