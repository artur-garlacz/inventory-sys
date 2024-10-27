import * as cdk from 'aws-cdk-lib';
import { ProductApiStack } from './ProductApiStack';
import { Code } from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App();

new ProductApiStack(app, {
  name: 'product-api',
  code: Code.fromAsset('../dist/')
});
