import { QueryHandler } from 'common-aws';

import { ProductRepository } from '../../core/repository/ProductRepository';

export interface GetProductListQuery {}
export interface GetProductListResponse {}

export type GetProductListQueryHandler = QueryHandler<GetProductListQuery, GetProductListResponse>;

interface GetProductListQueryHandlerDeps {
  productRepository: ProductRepository;
}

export const getProductListQueryHandler = ({productRepository}: GetProductListQueryHandlerDeps): GetProductListQueryHandler => {
  const handleAsync = async ({}: GetProductListQuery): Promise<GetProductListResponse> => {
    const w = await productRepository.getById('e');
    return { items: [], itemsCount: 13 };
  };

  return {
    handleAsync
  };
};
