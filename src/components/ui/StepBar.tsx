'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { useShallow } from 'zustand/react/shallow';
import { STEPS } from '@/lib/constants';

export default function StepBar() {
  const { currentStep, setStep } = useConfigStore(useShallow((s) => ({
    currentStep: s.currentStep,
    setStep: s.setStep,
  })));

  return (
    <div className="relative flex items-center w-full bg-gray-50 border-b border-gray-200 px-2">
      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[3px] bg-blue-500 transition-all duration-500 ease-out"
        style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
      />

      {STEPS.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <button
            key={step.id}
            onClick={() => setStep(step.id)}
            className={`flex-1 flex flex-col items-center py-2.5 px-1 transition-colors relative
              ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}
              hover:text-blue-500`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold mb-1 transition-all
                ${isActive
                  ? 'bg-blue-600 text-white shadow-md scale-110'
                  : isCompleted
                    ? 'bg-green-100 text-green-600 border border-green-300'
                    : 'bg-gray-200 text-gray-500'
                }`}
            >
              {isCompleted ? '\u2713' : step.id}
            </span>
            <span className="hidden md:block text-[11px] font-medium truncate max-w-[80px]">
              {step.shortLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
