import { requestHandlerBuilder, RequestHandlerBuilder } from 'common-aws';
import { productApiContainer, ProductApiRegistrations } from '../../config/productApiContainer';

export const productRequestBuilder = <TRequest>(): RequestHandlerBuilder<TRequest, ProductApiRegistrations> => {
  return requestHandlerBuilder(productApiContainer);
};
