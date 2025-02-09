import { handleCreateProductCommand } from './handlers/handleCreateProductCommand';
import { handleGetProducDetailsQuery } from './handlers/handleGetProductDetails';
import { handleGetProductListQuery } from './handlers/handleGetProductListQuery';
import { Route } from '@middy/http-router';

export const productRoutes: Route<any, any>[] = [
  {
    method: 'GET',
    path: '/products',
    handler: handleGetProductListQuery
  },
  {
    method: 'POST',
    path: '/products',
    handler: handleCreateProductCommand
  },
  {
    method: 'GET',
    path: '/products/details',
    handler: handleGetProducDetailsQuery
  }
];
