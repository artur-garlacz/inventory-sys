import { asFunction } from 'awilix';
import { createAppContainer, dynamoDocumentMapper } from 'common-aws';
import { productDependencies } from './productDependencies';

export const productApiContainer = createAppContainer({
  dynamoDocumentMapper: asFunction(dynamoDocumentMapper),

  ...productDependencies
});
