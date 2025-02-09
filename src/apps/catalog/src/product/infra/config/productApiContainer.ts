import { asFunction } from 'awilix';
import { ContainerRegistrations, createAppContainer, dynamoDocumentMapper } from 'common-aws';
import { productDependencies } from './productDependencies';

export type ProductApiRegistrations = ContainerRegistrations<typeof productApiContainer>;

export const productApiContainer = createAppContainer({
  executionContext: asFunction(() => processExecutionContext('products')),

  dynamoDocumentMapper: asFunction(dynamoDocumentMapper),

  ...productDependencies
});

export const processExecutionContext = (process: string) => ({
  getWorker: () => process
});
