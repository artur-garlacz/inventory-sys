import { Entity } from 'common-utils';
import { Pricing } from '../../../pricing/core/model/Pricing';

export interface Product extends Entity {
  name: string;
  description: string;
  pricing?: ProductPricingReference;
  sku: string;
  weight: number;
  status: ProductStatus;
  // dimensions: any;
  // supplier: SupplierReference;
}

export interface ProductPricingReference {
  basePrice: number;
  name: string;
  id: string;
}

export enum ProductStatus {
  Draft = 1,
  Active = 2,
  Deprecated = 3
}

export const setPricingToProduct = (product: Product, pricing: Pricing) => {
  product.pricing = {
    id: pricing.id,
    name: pricing.name,
    basePrice: pricing.basePrice
  };

  if (product.status === ProductStatus.Draft) {
    product.status = ProductStatus.Active;
  }
};
