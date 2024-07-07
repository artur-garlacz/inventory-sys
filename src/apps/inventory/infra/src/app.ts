import * as cdk from 'aws-cdk-lib';
import { InventoryApiStack } from './InventoryApiStack';
import { Code } from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App();

new InventoryApiStack(app, {
  name: 'inventory-api',
  code: Code.fromAsset('../dist/')
});
