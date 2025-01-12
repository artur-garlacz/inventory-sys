import { asFunction } from 'awilix';
import { dynamoDbFactory } from 'common-aws';
import { createBaseProductRepository, productRepository } from '../../core/repository/ProductRepository';

export const productRepositoryDependencies = {
  baseProductRepository: asFunction(() => createBaseProductRepository(dynamoDbFactory({}))),
  productRepository: asFunction(productRepository)
};
