import { Duration } from 'aws-cdk-lib';
import { Cors } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { AppApp, AppFunction, AppRestApi, AppStack, AppStackProps, OpenSearchService } from 'common-aws';
import { ProductTable } from '../resources/ProductTable';

export class ProductApiStack extends AppStack {
  constructor(scope: AppApp, props: AppStackProps) {
    super(scope, props);

    const productsTable = new ProductTable(this);

    const lambda = new AppFunction(this, 'product-api-lambda', {
      timeout: Duration.seconds(15),
      memorySize: 128,
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.productApiLambdaHandler',
      code: props.code,
      environment: {
        TABLE_NAME: productsTable.tableName
      }
    });

    const aossConstruct = new OpenSearchService(this, 'OpenSearchConstruct', {
      role: lambda.functionArn,
      collectionName: 'product'
    });

    aossConstruct.searchDomain;

    productsTable.grantReadWriteData(lambda);

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
