import { Entity } from 'common-utils';
import { SupplierReference } from './SupplierReference';

export interface Product extends Entity {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  weight: number;
  dimensions: any;
  supplier: SupplierReference;
}


export const associateSupplierToProduct = (product: Product, supplier: SupplierReference) => {
  product.supplier = supplier;
}