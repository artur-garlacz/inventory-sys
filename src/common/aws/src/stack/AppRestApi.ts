import {
  AuthorizationType,
  LambdaIntegration,
  MockIntegration,
  ProxyResource,
  RestApi,
  RestApiProps,
  MethodLoggingLevel
} from 'aws-cdk-lib/aws-apigateway';

import { AppFunction } from './AppFunction';
import { AppStack } from './AppStack';

interface AppRestApiProps extends RestApiProps {
  wafArn?: string;
}

export class AppRestApi extends RestApi {
  public constructor(scope: AppStack, id: string, props?: AppRestApiProps) {
    super(scope, id, {
      restApiName: id,
      ...props,
      deployOptions: {
        loggingLevel: MethodLoggingLevel.ERROR,
        stageName: 'dev',
        ...props?.deployOptions
      }
    });
  }

  public addDefaultProxyWithAnyMethod(lambda: AppFunction): ProxyResource {
    const proxy = this.root.addProxy({
      defaultIntegration: new MockIntegration(),
      anyMethod: false,
      defaultMethodOptions: {
        authorizationType: AuthorizationType.NONE
      }
    });

    proxy.addMethod('ANY', new LambdaIntegration(lambda), {
      authorizationType: AuthorizationType.NONE
    });

    return proxy;
  }
}
