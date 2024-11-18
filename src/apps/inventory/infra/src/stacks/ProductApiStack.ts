import { Duration } from 'aws-cdk-lib';
import { Cors } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { AppApp, AppFunction, AppRestApi, AppStack, AppStackProps } from 'common-aws';

export class ProductApiStack extends AppStack {
  constructor(scope: AppApp, props: AppStackProps) {
    super(scope, props);

    const lambda = new AppFunction(this, 'product-api-lambda', {
      timeout: Duration.seconds(15),
      memorySize: 128,
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.productApiLambdaHandler',
      code: props.code
    });

    const restApi = new AppRestApi(this, 'product-api-gateway', {
      restApiName: 'product-api',
      deployOptions: {
        metricsEnabled: true,
        dataTraceEnabled: true
      },
      cloudWatchRole: true,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        allowMethods: Cors.ALL_METHODS
      }
    });

    restApi.addDefaultProxyWithAnyMethod(lambda);
  }
}
