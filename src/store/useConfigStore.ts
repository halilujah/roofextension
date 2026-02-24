import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ConfigStore } from '@/types/configurator';
import { DEFAULT_CONFIG, TOTAL_STEPS } from '@/lib/constants';

export const useConfigStore = create<ConfigStore>()(
  immer((set, get) => ({
    ...DEFAULT_CONFIG,

    setStep: (step) => set((s) => {
      s.currentStep = Math.max(1, Math.min(TOTAL_STEPS, step));
    }),

    nextStep: () => set((s) => {
      s.currentStep = Math.min(TOTAL_STEPS, s.currentStep + 1);
    }),

    prevStep: () => set((s) => {
      s.currentStep = Math.max(1, s.currentStep - 1);
    }),

    setDormerType: (type) => set((s) => {
      s.dormerType = type;
    }),

    setSlopeAngle: (angle) => set((s) => {
      s.slopeAngle = Math.max(25, Math.min(65, angle));
    }),

    setHeight: (height) => set((s) => {
      s.height = Math.max(150, Math.min(280, height));
    }),

    setParapet: (parapet) => set((s) => {
      s.parapet = Math.max(10, Math.min(60, parapet));
    }),

    setPanelCount: (count) => set((s) => {
      const clamped = Math.max(0, Math.min(6, count));
      s.panelCount = clamped;
      const windowCount = clamped + 1;
      // Grow array if needed
      while (s.panelWidths.length < windowCount) {
        s.panelWidths.push({ frameWidth: 160, penantWidth: 20 });
      }
      // Shrink array if needed
      s.panelWidths.length = windowCount;
      // Last panel never has a penant
      s.panelWidths[windowCount - 1].penantWidth = 0;
    }),

    setPanelWidth: (index, field, value) => set((s) => {
      if (index >= 0 && index < s.panelWidths.length) {
        s.panelWidths[index][field] = value;
      }
    }),

    setSideMaterial: (material) => set((s) => {
      s.sideMaterial = material;
    }),

    setColor: (zone, color) => set((s) => {
      s.colors[zone] = color;
    }),

    setOption: (option, value) => set((s) => {
      s.options[option] = value;
    }),

    setPosition: (position) => set((s) => {
      s.position = position;
    }),

    setVizMode: (mode) => set((s) => {
      s.vizMode = mode;
    }),

    getTotalWidth: () => {
      const s = get();
      const panelTotal = s.panelWidths.reduce(
        (sum, p) => sum + p.frameWidth + p.penantWidth, 0
      );
      return panelTotal + 2 * s.sidewallWidth;
    },

    getWindowCount: () => get().panelCount + 1,
  }))
);
