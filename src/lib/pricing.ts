import { ConfigState } from '@/types/configurator';

export interface PriceBreakdown {
  basePrice: number;
  dimensionPrice: number;
  materialSurcharge: number;
  optionsPrice: number;
  panelSurcharge: number;
  total: number;
}

export function calculatePrice(config: ConfigState): PriceBreakdown {
  const basePrice = config.dormerType === 'traditional' ? 8500 : 9200;

  const totalWidthCm = config.panelWidths.reduce(
    (sum, p) => sum + p.frameWidth + p.penantWidth, 0
  ) + 2 * config.sidewallWidth;

  const widthPrice = totalWidthCm * 12;
  const heightPrice = config.height * 8;
  const dimensionPrice = widthPrice + heightPrice;

  const materialSurcharge = config.sideMaterial === 'hpl' ? 450 : 0;

  let optionsPrice = 0;
  if (config.options.rollerShutters) optionsPrice += 850;
  if (config.options.insectScreens) optionsPrice += 320;
  if (config.options.ventilationGrilles) optionsPrice += 180;

  const panelSurcharge = config.panelCount * 250;

  const total = basePrice + dimensionPrice + materialSurcharge + optionsPrice + panelSurcharge;

  return { basePrice, dimensionPrice, materialSurcharge, optionsPrice, panelSurcharge, total };
}
