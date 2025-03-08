import { Pricing } from '../model/Pricing';

export interface PricingRepository {
  createOrUpdate(product: Pricing): Promise<void>;
  createOrUpdateMany(product: Pricing[]): Promise<void>;
  getById(id: string): Promise<Pricing>;
}
