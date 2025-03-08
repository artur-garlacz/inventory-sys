import { Entity } from 'common-utils';
import { Pricing } from '../../../pricing/core/model/Pricing';

export interface Product extends Entity {
  description: string;
  category: string;
  brand?: string;
  attributes?: Record<string, string | number | boolean>;
  pricing?: ProductPricingReference;
  sku: string;
  weight: number;
  status: ProductStatus;
  images?: ProductImage[];
  dimensions?: ProductDimension;
}

export interface ProductPricingReference {
  basePrice: number;
  name: string;
  id: string;
}

interface ProductDimension {
  width: number;
  height: number;
  depth: number;
}

interface ProductImage {
  alt: string;
  url: string;
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
