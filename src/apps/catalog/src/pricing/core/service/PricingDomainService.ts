import { CustomerPricingType, CustomerTieredPricing } from '../model/Pricing';

export interface PricingDomainService {
  validatePricing(pricing: { tieredPricings?: CustomerTieredPricing[]; basePrice: number }): void;
}

export const pricingDomainService = (): PricingDomainService => {
  const validateTierPricing = (tieredPricings?: CustomerTieredPricing[]) => {
    if (!tieredPricings || !tieredPricings.length) return;

    for (const customerTier of tieredPricings) {
      if (!Object.values(CustomerPricingType).includes(customerTier.customerType)) {
        throw new Error(`Invalid customer pricing type: ${customerTier.customerType}`);
      }
      for (const tier of customerTier.pricing) {
        if (tier.quantityThreshold <= 0 || tier.price < 0) {
          throw new Error('Tiered pricing must have positive quantityThreshold and non-negative price.');
        }
      }
    }
  };

  const validatePricing = ({
    tieredPricings,
    basePrice
  }: {
    tieredPricings?: CustomerTieredPricing[];
    basePrice: number;
  }) => {
    if (basePrice < 0) {
      throw new Error('Base price must be non-negative.');
    }

    validateTierPricing(tieredPricings);
  };
  return { validatePricing };
};
