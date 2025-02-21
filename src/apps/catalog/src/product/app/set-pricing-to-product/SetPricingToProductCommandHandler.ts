import { CommandHandler } from 'common-aws';
import { ProductRepository } from '../../core/repository/ProductRepository';
import { setPricingToProduct } from '../../core/models/Product';
import { Pricing } from '../../../pricing/core/model/Pricing';

type SetPricingToProductCommand = {
  pricingId: string;
  productId: string;
};

export type SetPricingToProductCommandHandler = CommandHandler<SetPricingToProductCommand, void>;

interface SetPricingToProductCommandHandlerDeps {
  productRepository: ProductRepository;
}

export const setPricingToProductCommandHandler = ({
  productRepository
}: SetPricingToProductCommandHandlerDeps): SetPricingToProductCommandHandler => {
  const handleAsync = async (command: SetPricingToProductCommand) => {
    const product = await productRepository.getById(command.productId);
    const pricing = (await productRepository.getById(command.pricingId)) as unknown as Pricing;

    setPricingToProduct(product, pricing);

    await productRepository.createOrUpdate(product);

    //raise domain event
  };

  return {
    handleAsync
  };
};
