import { StepDefinition, ConfigState } from '@/types/configurator';

export const STEPS: StepDefinition[] = [
  { id: 1, key: 'dimensions', label: 'Dimensions',        shortLabel: 'Dims',     description: 'Configure dormer type and dimensions' },
  { id: 2, key: 'roof',       label: 'Roof Angle',        shortLabel: 'Roof',     description: 'How sloped is your roof?' },
  { id: 3, key: 'materials',  label: 'Materials & Colors', shortLabel: 'Colors',   description: 'Choose materials and colors' },
  { id: 4, key: 'options',    label: 'Extra Options',      shortLabel: 'Options',  description: 'Add extra options' },
  { id: 5, key: 'overview',   label: 'Overview',           shortLabel: 'Summary',  description: 'Review your configuration' },
  { id: 6, key: 'quote',      label: 'Quote Request',      shortLabel: 'Quote',    description: 'Request your personalized quote' },
];

export const TOTAL_STEPS = STEPS.length;

export const COLOR_PALETTES = {
  frontAndSides: [
    '#2D4A3A', '#3B5C4A', '#4A6B52', '#1E3328', '#162A1F',
    '#F0EDE8', '#E8E4DF', '#D4CFC9', '#B0AAA2', '#8A847C',
    '#5A5550', '#43403C', '#2C2A28', '#3A2E26', '#4D3F35',
    '#6B5B50', '#8C7B6E', '#C4B8AC', '#2A3050', '#1E3A5C',
  ],
  overhang: [
    '#2C2A28', '#43403C', '#1E1D1C', '#383634', '#141313',
    '#F0EDE8', '#E8E4DF', '#D4CFC9', '#B0AAA2', '#8A847C',
    '#2D4A3A', '#3A2E26', '#4D3F35', '#6B5B50', '#1E3A5C',
  ],
  frame: [
    '#2C2A28', '#43403C', '#1E1D1C', '#383634', '#141313',
    '#F0EDE8', '#E8E4DF', '#D4CFC9', '#B0AAA2', '#8A847C',
    '#2D4A3A', '#3A2E26', '#4D3F35', '#6B5B50', '#1E3A5C',
  ],
  window: [
    '#F0EDE8', '#E8E4DF', '#D4CFC9', '#B0AAA2', '#8A847C',
    '#2C2A28', '#43403C', '#1E1D1C', '#383634', '#141313',
    '#6B5B50', '#8C7B6E', '#C4B8AC', '#2D4A3A', '#1E3A5C',
  ],
};

export const CONSTRAINTS = {
  slopeAngle: { min: 25, max: 65, step: 1 },
  height:     { min: 150, max: 280, step: 5 },
  parapet:    { min: 10, max: 60, step: 1 },
  panelCount: { min: 0, max: 6, step: 1 },
  frameWidth: { min: 60, max: 400, step: 10 },
  penantWidth:{ min: 10, max: 60, step: 5 },
};

export const DEFAULT_CONFIG: ConfigState = {
  currentStep: 1,
  dormerType: 'traditional',
  slopeAngle: 44,
  height: 205,
  parapet: 26,
  panelCount: 2,
  panelWidths: [
    { frameWidth: 250, penantWidth: 20 },
    { frameWidth: 200, penantWidth: 20 },
    { frameWidth: 160, penantWidth: 0 },
  ],
  sidewallWidth: 37,
  sideMaterial: 'vinyplus',
  colors: {
    frontAndSides: '#2D4A3A',
    overhang: '#1E1D1C',
    frame: '#1E1D1C',
    window: '#F0EDE8',
  },
  options: {
    rollerShutters: false,
    insectScreens: false,
    ventilationGrilles: false,
  },
  position: 'front',
  vizMode: 'realistic',
};
