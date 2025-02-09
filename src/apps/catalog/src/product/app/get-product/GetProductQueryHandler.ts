import { QueryHandler } from 'common-aws';

import { ProductRepository } from '../../core/repository/ProductRepository';

export interface GetProductQuery {
  productId: string;
}
export interface GetProductResponse {}

export type GetProductQueryHandler = QueryHandler<GetProductQuery, GetProductResponse>;

interface GetProductQueryHandlerDeps {
  productRepository: ProductRepository;
}

export const getProductQueryHandler = ({ productRepository }: GetProductQueryHandlerDeps): GetProductQueryHandler => {
  const handleAsync = async ({ productId }: GetProductQuery): Promise<GetProductResponse> => {
    const product = await productRepository.getById(productId);
    return { data: product };
  };

  return {
    handleAsync
  };
};
