import { handleCreateProductCommand } from './handlers/handleCreateProductCommand';
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
  }
];
