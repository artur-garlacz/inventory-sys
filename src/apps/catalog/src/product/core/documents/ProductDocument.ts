import { Product } from '../model/Product';

export interface ProductDocument {
  id: string;
  name: string;
  description: string;
  sku: string;
}

export const mapProductToProductDocument = (product: Product): ProductDocument => {
  return {
    ...product
  };
};
