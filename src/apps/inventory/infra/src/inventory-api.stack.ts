import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Cors, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import path = require('path');

export class InventoryApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambda = new Function(scope, 'inventory-api', {
      timeout: Duration.seconds(100),
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.inventoryApiLambdaHandler',
      code: Code.fromAsset(path.join(__dirname, 'lambda-handler'))
    });

    const restApi = new RestApi(scope, 'inventory-api', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        allowMethods: Cors.ALL_METHODS
      }
    });

    // restApi.addD
  }
}

// export class InfraStack extends Stack {
//   constructor(scope: Construct, id: string, props?: StackProps) {
//     super(scope, id, props);

//     const queue = new sqs.Queue(this, 'InfraQueue', {
//       visibilityTimeout: Duration.seconds(300)
//     });

//     const topic = new sns.Topic(this, 'InfraTopic');

//     topic.addSubscription(new subs.SqsSubscription(queue));
//   }
// }
