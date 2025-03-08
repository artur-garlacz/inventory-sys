import { Product } from '../model/Product';

export interface ProductRepository {
  createOrUpdate(product: Product): Promise<void>;
  createOrUpdateMany(product: Product[]): Promise<void>;
  getById(id: string): Promise<Product>;
}
