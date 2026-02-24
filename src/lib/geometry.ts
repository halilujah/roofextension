import { PanelWidth } from '@/types/configurator';

// Distance along the roof slope from gutter to dormer front edge (meters)
export const ROOF_SETBACK = 2.0;
// Extra roof margin on left/right sides beyond the dormer
export const ROOF_MARGIN = 1.5;

export function cmToM(cm: number): number {
  return cm / 100;
}

export function calcDepthAlongSlope(slopeAngleDeg: number, heightCm: number): number {
  const rad = (slopeAngleDeg * Math.PI) / 180;
  return cmToM(heightCm) / Math.sin(rad);
}

export function calcDormerDepth(slopeAngleDeg: number, heightCm: number): number {
  const rad = (slopeAngleDeg * Math.PI) / 180;
  return cmToM(heightCm) / Math.tan(rad);
}

export function calcTotalWidth(panelWidths: PanelWidth[], sidewallWidth: number): number {
  const panelTotal = panelWidths.reduce(
    (sum, p) => sum + p.frameWidth + p.penantWidth, 0
  );
  return cmToM(panelTotal + 2 * sidewallWidth);
}

export interface WindowPosition {
  x: number;
  width: number;
  isLast: boolean;
}

export function calcWindowPositions(
  panelWidths: PanelWidth[],
  sidewallWidth: number
): WindowPosition[] {
  const totalWidthM = calcTotalWidth(panelWidths, sidewallWidth);
  let currentX = -totalWidthM / 2 + cmToM(sidewallWidth);

  return panelWidths.map((panel, i) => {
    const widthM = cmToM(panel.frameWidth);
    const x = currentX + widthM / 2;
    currentX += widthM + cmToM(panel.penantWidth);
    return {
      x,
      width: panel.frameWidth,
      isLast: i === panelWidths.length - 1,
    };
  });
}
