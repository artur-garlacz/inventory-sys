import { BillingMode, Table, TableEncryption, TableProps, ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Grant, IGrantable } from 'aws-cdk-lib/aws-iam';

import { AppStack } from './AppStack';

export class AppTable extends Table {
  public constructor(scope: AppStack, id: string, props: TableProps) {
    super(scope, id, {
      ...props,
      tableName: id,
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.CUSTOMER_MANAGED
    });
  }
}

export const grantBackupFullAccess = (table: ITable, grantee: IGrantable): Grant => {
  grantTableListBackups(table, grantee);

  return Grant.addToPrincipal({
    scope: table,
    grantee,
    actions: ['dynamodb:DescribeBackup', 'dynamodb:CreateBackup', 'dynamodb:RestoreTableFromBackup'],
    resourceArns: [table.tableArn, `${table.tableArn}/backup/*`]
  });
};

export const grantTableManipulation = (table: ITable, grantee: IGrantable): Grant => {
  grantDescribeTable(table, grantee);

  return Grant.addToPrincipal({
    scope: table,
    grantee,
    actions: ['dynamodb:UpdateTable', 'dynamodb:DeleteTable', 'dynamodb:DescribeTable'],
    resourceArns: [table.tableArn]
  });
};

export const grantAnyStreamRead = (table: ITable, grantee: IGrantable): Grant => {
  table.grantTableListStreams(grantee);

  return Grant.addToPrincipal({
    scope: table,
    grantee,
    actions: ['dynamodb:DescribeStream', 'dynamodb:GetRecords', 'dynamodb:GetShardIterator'],
    resourceArns: [`${table.tableArn}/stream/*`]
  });
};

const grantTableListBackups = (table: ITable, grantee: IGrantable): Grant => {
  return Grant.addToPrincipal({
    scope: table,
    grantee,
    actions: ['dynamodb:ListBackups'],
    resourceArns: [`*`]
  });
};

const grantDescribeTable = (table: ITable, grantee: IGrantable): Grant => {
  return Grant.addToPrincipal({
    scope: table,
    grantee,
    actions: ['dynamodb:DescribeTable'],
    resourceArns: [table.tableArn]
  });
};
