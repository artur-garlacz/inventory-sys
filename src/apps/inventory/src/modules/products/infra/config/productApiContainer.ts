import { asFunction } from 'awilix';
import { ContainerRegistrations, createAppContainer, dynamoDocumentMapper } from 'common-aws';
import { productDependencies } from './productDependencies';

export type ProductApiRegistrations = ContainerRegistrations<typeof productApiContainer>;

export const productApiContainer = createAppContainer({
  dynamoDocumentMapper: asFunction(dynamoDocumentMapper),

  ...productDependencies
});
