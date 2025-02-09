import { GetProductListQuery } from '../../../app/get-products/GetProductListQueryHandler';
import { productRequestBuilder } from '../builders/productRequestBuilder';

export const handleCreateProductCommand = productRequestBuilder<GetProductListQuery>()
  .withCommandHandler('createProductCommandHandler')
  .withLogging()
  .build();
