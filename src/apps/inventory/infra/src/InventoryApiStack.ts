import { App, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Cors, LambdaRestApi, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

import { AppStack, AppStackProps } from './AppStack';

export class InventoryApiStack extends AppStack {
  constructor(scope: App, props: AppStackProps) {
    super(scope, props);

    const lambda = new NodejsFunction(this, 'inventory-api-lambda', {
      timeout: Duration.seconds(100),
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.inventoryApiLambdaHandler',
      code: props.code
    });

    new LambdaRestApi(this, 'inventory-api-gateway', {
      handler: lambda,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        allowMethods: Cors.ALL_METHODS
      }
    });
  }
}
