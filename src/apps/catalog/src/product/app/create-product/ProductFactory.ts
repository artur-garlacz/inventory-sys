import { generateId } from 'common-utils';
import { Product, ProductStatus } from '../../core/model/Product';

export interface ProductFactory {
  create(data: CreateProductDto): Product;
}

interface CreateProductDto {
  name: string;
  description: string;
  sku: string;
  weight: number;
}

export const productFactory = (): ProductFactory => {
  const create = (data: CreateProductDto): Product => {
    const product: Product = {
      id: generateId(),
      name: data.name,
      description: data.description,
      sku: data.sku,
      status: ProductStatus.Draft,
      pricing: undefined,
      weight: data.weight
    };

    return product;
  };

  return { create };
};
