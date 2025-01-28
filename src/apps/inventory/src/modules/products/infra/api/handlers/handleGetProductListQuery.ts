import { GetProductListQuery } from '../../../app/get-products/GetProductListQueryHandler';
import { productRequestBuilder } from '../builders/productRequestBuilder';

export const handleGetProductListQuery = productRequestBuilder<GetProductListQuery>()
  .withQueryHandler('getProductListQueryHandler')
  .withLogging()
  .build();
