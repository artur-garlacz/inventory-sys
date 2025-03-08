import { Entity } from 'common-utils';

export interface Pricing extends Entity {
  name: string;
  basePrice: number;
  tieredPricings?: CustomerTieredPricing[];
  discount?: {
    percentage?: number;
    fixedAmount?: number;
    validUntil?: string;
  };
}

export interface TieredPricing {
  quantityThreshold: number;
  price: number;
}

export enum CustomerPricingType {
  Retail = 1,
  Wholesale = 2,
  Vip = 3
}

export interface CustomerTieredPricing {
  customerType: CustomerPricingType;
  pricing: TieredPricing[];
}
