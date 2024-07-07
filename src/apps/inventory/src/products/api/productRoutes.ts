import { handleGetProductsQuery } from './handlers/handleGetProductsQuery';
import { Route } from '@middy/http-router';

export const productRoutes: Route<any, any>[] = [
  {
    method: 'GET',
    path: '/products',
    handler: handleGetProductsQuery
  }
];
