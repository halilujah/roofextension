'use client';

import { useConfigStore } from '@/store/useConfigStore';
import { STEPS } from '@/lib/constants';
import { AnimatePresence, motion } from 'framer-motion';
import DimensionsStep from './steps/DimensionsStep';
import RoofAngleStep from './steps/RoofAngleStep';
import MaterialsColorStep from './steps/MaterialsColorStep';
import OptionsStep from './steps/OptionsStep';
import OverviewStep from './steps/OverviewStep';
import QuoteStep from './steps/QuoteStep';

const stepComponents: Record<number, React.ReactNode> = {
  1: <DimensionsStep />,
  2: <RoofAngleStep />,
  3: <MaterialsColorStep />,
  4: <OptionsStep />,
  5: <OverviewStep />,
  6: <QuoteStep />,
};

export default function StepContent() {
  const currentStep = useConfigStore((s) => s.currentStep);
  const step = STEPS.find((s) => s.id === currentStep);

  return (
    <div className="h-full">
      {/* Step header */}
      <div className="px-4 pt-3 pb-1">
        <h2 className="text-base font-bold text-gray-900">{step?.label}</h2>
        <p className="text-xs text-gray-500">{step?.description}</p>
      </div>

      {/* Step form */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {stepComponents[currentStep]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
