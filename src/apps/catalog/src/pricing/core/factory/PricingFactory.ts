import { generateId } from 'common-utils';
import { CustomerTieredPricing, Pricing } from '../model/Pricing';

export interface PricingFactory {
  create(data: CreatePricingDto): Pricing;
}

interface CreatePricingDto {
  name: string;
  basePrice: number;
  tieredPricings?: CustomerTieredPricing[];
}

export const pricingFactory = (): PricingFactory => {
  const create = (data: CreatePricingDto): Pricing => {
    const pricing: Pricing = {
      id: generateId(),
      basePrice: data.basePrice,
      name: data.name,
      tieredPricings: data.tieredPricings
    };

    return pricing;
  };

  return { create };
};
