import { CommandHandler } from 'common-aws';

import { CreateProductCommand } from './CreateProductCommand';
import { ProductRepository } from '../../core/repository/ProductRepository';
import { ProductFactory } from './ProductFactory';

export type CreateProductCommandHandler = CommandHandler<CreateProductCommand, { id: string }>;

interface CreateProductCommandHandlerDeps {
  productRepository: ProductRepository;
  productFactory: ProductFactory;
}

export const createProductCommandHandler = ({
  productRepository,
  productFactory
}: CreateProductCommandHandlerDeps): CreateProductCommandHandler => {
  const handleAsync = async (command: CreateProductCommand) => {
    const product = productFactory.create(command);

    await productRepository.createOrUpdate(product);

    return { id: product.id };
  };

  return {
    handleAsync
  };
};
