import { generateId } from 'common-utils';
import { Product } from '../../core/models/Product';

export interface ProductFactory {
  create(data: CreateProductDto): Product;
}

interface CreateProductDto {
  name: string;
  description: string;
  sku: string;
  price: number;
  weight: number;
}

export const productFactory = (): ProductFactory => {
  const create = (data: CreateProductDto): Product => {
    const product: Product = {
      id: generateId(),
      name: data.name,
      description: data.description,
      sku: data.sku,
      price: data.price,
      weight: data.weight
    };

    return product;
  };

  return { create };
};
