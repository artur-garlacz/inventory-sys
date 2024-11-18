import * as cdk from 'aws-cdk-lib';
import { ProductApiStack } from './stacks/ProductApiStack';
import { Code } from 'aws-cdk-lib/aws-lambda';
import { AppApp } from 'common-aws';

const app = new AppApp({});

new ProductApiStack(app, {
  name: 'product-api',
  code: Code.fromAsset('../dist/')
});
