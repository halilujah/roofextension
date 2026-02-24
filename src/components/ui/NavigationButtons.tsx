'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { useShallow } from 'zustand/react/shallow';
import { TOTAL_STEPS } from '@/lib/constants';
import PriceDisplay from './PriceDisplay';

export default function NavigationButtons() {
  const { currentStep, nextStep, prevStep } = useConfigStore(useShallow((s) => ({
    currentStep: s.currentStep,
    nextStep: s.nextStep,
    prevStep: s.prevStep,
  })));

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
      <button
        onClick={prevStep}
        disabled={currentStep === 1}
        className={`flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-all
          ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10 4L6 8L10 12" />
        </svg>
        Back
      </button>

      <PriceDisplay />

      <button
        onClick={nextStep}
        disabled={currentStep === TOTAL_STEPS}
        className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95
          ${currentStep === TOTAL_STEPS
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-400 text-white hover:bg-blue-500 shadow-md hover:shadow-lg'
          }`}
      >
        {currentStep === TOTAL_STEPS ? 'Done' : 'Next'}
        {currentStep < TOTAL_STEPS && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="inline ml-1">
            <path d="M6 4L10 8L6 12" />
          </svg>
        )}
      </button>
    </div>
  );
}
