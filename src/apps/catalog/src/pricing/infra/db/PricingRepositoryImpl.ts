import { pricing } from '../../../infa/db/schema';
import { PricingRepository } from '../../core/repository/PricingRepository';

export const pricingRepositoryImpl = (): PricingRepository => {
  const createPricing = async (data: { name: string; basePrice: number; currency: string }) => {
    return db.insert(pricing).values(data).returning();
  };

  const getPricing = async (id: number) => {
    return db.select().from(pricing).where(eq(pricing.id, id));
  };

  const updatePricing = async (id: number, newData: Partial<typeof pricing.$inferInsert>) => {
    return db.update(pricing).set(newData).where(eq(pricing.id, id)).returning();
  };

  const deletePricing = async (id: number) => {
    return db.delete(pricing).where(eq(pricing.id, id)).returning();
  };

  return {
    createPricing
  };
};
