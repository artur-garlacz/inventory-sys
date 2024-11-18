import { App } from 'aws-cdk-lib';

interface AppAppProps {
  targetBranchName?: string;
}

export class AppApp extends App {
  public constructor(props: AppAppProps) {
    super();
  }
}
