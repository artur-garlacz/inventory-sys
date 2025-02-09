import { GetProductQuery } from '../../../app/get-product/GetProductQueryHandler';
import { productRequestBuilder } from '../builders/productRequestBuilder';

export const handleGetProducDetailsQuery = productRequestBuilder<GetProductQuery>()
  .withQueryHandler('getProductListQueryHandler')
  .withLogging()
  .build();
