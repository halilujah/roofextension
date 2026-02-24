export type DormerType = 'traditional' | 'frame';
export type SideMaterial = 'vinyplus' | 'hpl';
export type DormerPosition = 'front' | 'back' | 'left' | 'right';
export type VizMode = 'realistic' | 'shaded' | 'shadedEdges' | 'textured';

export interface PanelWidth {
  frameWidth: number;   // cm
  penantWidth: number;  // cm (0 for last panel)
}

export interface DormerColors {
  frontAndSides: string;
  overhang: string;
  frame: string;
  window: string;
}

export interface DormerOptions {
  rollerShutters: boolean;
  insectScreens: boolean;
  ventilationGrilles: boolean;
}

export interface StepDefinition {
  id: number;
  key: string;
  label: string;
  shortLabel: string;
  description: string;
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
}

export interface ConfigState {
  currentStep: number;
  dormerType: DormerType;
  slopeAngle: number;
  height: number;
  parapet: number;
  panelCount: number;
  panelWidths: PanelWidth[];
  sidewallWidth: number;
  sideMaterial: SideMaterial;
  colors: DormerColors;
  options: DormerOptions;
  position: DormerPosition;
  vizMode: VizMode;
}

export interface ConfigActions {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setDormerType: (type: DormerType) => void;
  setSlopeAngle: (angle: number) => void;
  setHeight: (height: number) => void;
  setParapet: (parapet: number) => void;
  setPanelCount: (count: number) => void;
  setPanelWidth: (index: number, field: 'frameWidth' | 'penantWidth', value: number) => void;
  setSideMaterial: (material: SideMaterial) => void;
  setColor: (zone: keyof DormerColors, color: string) => void;
  setOption: (option: keyof DormerOptions, value: boolean) => void;
  setPosition: (position: DormerPosition) => void;
  setVizMode: (mode: VizMode) => void;
  getTotalWidth: () => number;
  getWindowCount: () => number;
}

export type ConfigStore = ConfigState & ConfigActions;
