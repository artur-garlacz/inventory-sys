import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Code } from 'aws-cdk-lib/aws-lambda';
import { AppApp } from './AppApp';

export interface AppStackProps extends StackProps {
  name: string;
  code?: Code;
  isGlobal?: boolean;
}

export class AppStack extends Stack {
  public readonly id: string;
  public readonly name: string;
  public readonly code?: Code;

  protected constructor(scope: AppApp, props: AppStackProps) {
    super(scope, props.name, props);

    this.id = props.name;
    this.name = props.name;
    this.code = props.code;
  }
}
