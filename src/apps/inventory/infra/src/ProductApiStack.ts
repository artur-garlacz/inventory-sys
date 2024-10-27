import { App, Duration } from 'aws-cdk-lib';
import { AuthorizationType, Cors, LambdaIntegration, MockIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {AppStack, AppStackProps} from 'common-aws';

export class ProductApiStack extends AppStack {
  constructor(scope: App, props: AppStackProps) {
    super(scope, props);

    // @ts-ignore
      const lambda = new NodejsFunction(this, 'product-api-lambda', {
      timeout: Duration.seconds(15),
      memorySize: 128,
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.productApiLambdaHandler',
      code: props.code
    });

    const restApi = new RestApi(this, 'product-api-gateway', {
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

    const proxy = restApi.root.addProxy({
      defaultIntegration: new MockIntegration(),
      anyMethod: false,
      defaultMethodOptions: {
        authorizationType: AuthorizationType.NONE
      }
    });

    proxy.addMethod('ANY', new LambdaIntegration(lambda), {
      authorizationType: AuthorizationType.NONE
    });
  }
}
