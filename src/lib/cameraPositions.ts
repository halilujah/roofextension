import { CameraState } from '@/types/configurator';

// Dormer center is roughly at y≈2.4, z≈-1.4 with default config
// (ROOF_SETBACK=2.0m, height=205cm, slope=44°)
export const CAMERA_POSITIONS: Record<number, CameraState> = {
  1: { position: [0, 3.5, 8],     target: [0, 2.2, -1.4] },     // Front: see panels, widths, height
  2: { position: [6, 3, -1],      target: [0, 2.2, -1.4] },     // Side profile: show slope angle
  3: { position: [5, 3.5, 6],     target: [0, 2.2, -1.4] },     // 3/4 front: see all surfaces
  4: { position: [4.5, 3.5, 5.5], target: [0, 2.2, -1.4] },     // 3/4 front: show features
  5: { position: [5, 4, 7],       target: [0, 2.0, -1.4] },     // 3/4 elevated: full showcase
  6: { position: [5, 4, 7],       target: [0, 2.0, -1.4] },     // Same as overview
};
