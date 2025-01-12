import { asFunction } from 'awilix';
import { productRepositoryDependencies } from './productRepositoryDependencies';
import { getProductListQueryHandler } from '../../app/get-products/GetProductListQueryHandler';
import { createProductCommandHandler } from '../../app/create-product/CreateProductCommandHandler';

export const productDependencies = {
  ...productRepositoryDependencies,

  getProductListQueryHandler: asFunction(getProductListQueryHandler),
  createProductCommandHandler: asFunction(createProductCommandHandler)
};
