import { CommandHandler } from 'common-aws';
import { CustomerTieredPricing } from '../../core/model/Pricing';

type CreatePricingCommand = {
  basePrice: number;
  tieredPricings: CustomerTieredPricing[];
};

export type CreatePricingCommandHandler = CommandHandler<CreatePricingCommand, void>;

interface CreatePricingCommandHandlerDeps {
  pricingRepository: any;
}

export const createPricingCommandHandler = ({
  pricingRepository
}: CreatePricingCommandHandlerDeps): CreatePricingCommandHandler => {
  const handleAsync = async (command: CreatePricingCommand) => {
    //raise domain event
  };

  return {
    handleAsync
  };
};
