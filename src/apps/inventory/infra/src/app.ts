import * as cdk from 'aws-cdk-lib';
import { InventoryApiStack } from './inventory-api.stack';

const app = new cdk.App();
new InventoryApiStack(app, 'InventoryApiStack');
