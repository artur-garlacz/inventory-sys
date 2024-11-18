import { Function, FunctionProps, Runtime } from 'aws-cdk-lib/aws-lambda';

import { AppStack } from './AppStack';

type AppFunctionProps = Omit<FunctionProps, 'runtime' | 'code'> & Partial<Pick<FunctionProps, 'runtime' | 'code'>>;

export class AppFunction extends Function {
  public constructor(scope: AppStack, id: string, props: AppFunctionProps) {
    const functionName = props.functionName ?? id;
    const code = props.code ?? scope.code;

    if (code === undefined) {
      throw new Error("Sprint function is missing 'code'.");
    }

    super(scope, id, {
      ...props,
      functionName,
      code,
      runtime: props.runtime ?? Runtime.NODEJS_20_X,
      environment: {
        ...props.environment
      }
    });
  }
}
