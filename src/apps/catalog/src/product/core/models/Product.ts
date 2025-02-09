import { Entity } from 'common-utils';
import { SupplierReference } from './SupplierReference';

export interface Product extends Entity {
  name: string;
  description: string;
  price: number;
  sku: string;
  weight: number;
  // dimensions: any;
  // supplier: SupplierReference;
}
