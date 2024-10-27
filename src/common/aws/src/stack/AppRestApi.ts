import {
  AuthorizationType,
  LambdaIntegration,
  MockIntegration,
  ProxyResource,
  RestApi,
  RestApiProps,
  CfnClientCertificate,
  MethodLoggingLevel,
  TokenAuthorizer
} from 'aws-cdk-lib/aws-apigateway';
import { CfnWebACLAssociation } from 'aws-cdk-lib/aws-wafv2';

import { globalConstructNameFactory } from '../naming/globalConstructNameFactory';
import { SystemManager } from '../system/SystemManager';
import { SprintFunction } from './SprintFunction';
import { SprintStack } from './SprintStack';

interface SprintRestApiProps extends RestApiProps {
  wafArn?: string;
}

export class SprintRestApi extends RestApi {
  private readonly systemManager: SystemManager;

  private readonly parentScope: SprintStack;

  public constructor(scope: SprintStack, id: string, props?: SprintRestApiProps) {
    const { region, accountId } = scope.systemManager;

    const clientCertificateName = `${id}-client-cert`;
    const clientCertificate = new CfnClientCertificate(scope, clientCertificateName, {
      description: id
    });

    super(scope, id, {
      restApiName: id,
      ...props,
      deployOptions: {
        loggingLevel: MethodLoggingLevel.ERROR,
        stageName: 'dev',
        tracingEnabled: scope.systemManager.branchName === 'master',
        clientCertificateId: clientCertificate.ref,
        ...props?.deployOptions
      }
    });

    this.systemManager = scope.systemManager;

    this.parentScope = scope;
  }

  public addDefaultProxyWithAnyMethod(lambda: SprintFunction): ProxyResource {
    const proxy = this.root.addProxy({
      defaultIntegration: new MockIntegration(),
      anyMethod: false,
      defaultMethodOptions: {
        authorizationType: AuthorizationType.NONE
      }
    });

    const authorizeLambdaName = globalConstructNameFactory({
      module: 'core',
      prefix: this.systemManager.resourceScope === 'prod' ? 'prod' : ''
    }).lambda('authorizer');

    const authorizeLambda = SprintFunction.fromFunctionArn(
      this.parentScope,
      `${this.restApiName}-authorizer-ref`,
      `arn:aws:lambda:${this.systemManager.region}:${this.systemManager.accountId}:function:${authorizeLambdaName}`
    );

    const authorizerName = this.systemManager.nameFactory.authorizer('lambda');
    const authorizer = new TokenAuthorizer(this.parentScope, authorizerName, {
      authorizerName,
      handler: authorizeLambda
    });

    proxy.addMethod('ANY', new LambdaIntegration(lambda), {
      authorizationType: AuthorizationType.CUSTOM,
      authorizer
    });

    return proxy;
  }
}
