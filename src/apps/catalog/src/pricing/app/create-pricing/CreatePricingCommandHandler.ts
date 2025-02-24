import { CommandHandler } from 'common-aws';
import { CustomerTieredPricing } from '../../core/model/Pricing';
import { PricingDomainService } from '../../core/service/PricingDomainService';
import { PricingFactory } from '../../core/factory/PricingFactory';

type CreatePricingCommand = {
  name: string;
  basePrice: number;
  tieredPricings: CustomerTieredPricing[];
};

export type CreatePricingCommandHandler = CommandHandler<CreatePricingCommand, { id: string }>;

interface CreatePricingCommandHandlerDeps {
  pricingRepository: any;
  pricingDomainService: PricingDomainService;
  pricingFactory: PricingFactory;
}

export const createPricingCommandHandler = ({
  pricingFactory,
  pricingRepository,
  pricingDomainService
}: CreatePricingCommandHandlerDeps): CreatePricingCommandHandler => {
  const handleAsync = async (command: CreatePricingCommand) => {
    pricingDomainService.validatePricing({ basePrice: command.basePrice, tieredPricings: command.tieredPricings });

    const pricing = pricingFactory.create({
      basePrice: command.basePrice,
      name: command.name,
      tieredPricings: command.tieredPricings
    });

    return { id: pricing.id };
  };

  return {
    handleAsync
  };
};
