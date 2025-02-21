import { Entity } from 'common-utils';

export interface Pricing extends Entity {
  name: string;
  basePrice: number;
  currency: string;
  tieredPricings?: CustomerTieredPricing[];
  discount?: {
    percentage?: number; // % off
    fixedAmount?: number; // Absolute discount (e.g., $5 off)
    validUntil?: string; // Expiration date for discount
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
