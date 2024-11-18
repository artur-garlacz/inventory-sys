import { Duration } from 'aws-cdk-lib';
import { Alias } from 'aws-cdk-lib/aws-kms';
import { AppStack, AppStackProps } from 'common-aws';
import { ProductTable } from '../resources/ProductTable';

export class ProductCoreStack extends AppStack {
  public constructor(scope: SprintApp, props: AppStackProps) {
    super(scope, props);

    const masterTable = new ProductTable(this);

    const elasticsearchEndpoint = this.parameterStore.getGlobal(this, 'core', OPENSEARCH_ENDPOINT);
    const domainArn = this.parameterStore.getGlobal(this, 'core', OPENSEARCH_DOMAIN_ARN);

    const masterIndexName = this.nameFactory.index(MASTER_INDEX_NAME);
    const technicalFixIndexName = this.nameFactory.index(TECHNICAL_FIX_INDEX_NAME);

    const lambdaVpc = getLambdaVpc(this, this.systemManager.resourceScope);

    const masterStreamHandlerLambdaName = this.nameFactory.lambda(MASTER_STREAM_HANDLER_LAMBDA_NAME);
    const masterStreamHandlerLambda = new AppF(this, masterStreamHandlerLambdaName, {
      handler: 'index.masterTableStreamHandler',
      retryAttempts: 0,
      vpc: lambdaVpc,
      timeout: Duration.seconds(30),
      environment: {
        ELASTICSEARCH_ENDPOINT: elasticsearchEndpoint,
        MASTER_INDEX_NAME: masterIndexName,
        TECHNICAL_FIX_INDEX_NAME: technicalFixIndexName
      }
    });

    grantAnyStreamRead(masterTable, masterStreamHandlerLambda);
    grantIndexWrite(masterStreamHandlerLambda, domainArn, masterIndexName);
    grantIndexWrite(masterStreamHandlerLambda, domainArn, technicalFixIndexName);

    const seedLambdaName = this.nameFactory.lambda(SEED_MASTER_LAMBDA_NAME);
    const seedLambda = new SprintFunction(this, seedLambdaName, {
      handler: 'index.seedMasterDataLambdaHandler',
      timeout: Duration.minutes(5),
      retryAttempts: 0,
      invocationType: 'pipeline',
      environment: {
        TABLE_NAME: masterTable.tableName
      }
    });

    masterTable.grantReadWriteData(seedLambda);
  }
}
