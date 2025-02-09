import { AttributeType, ITable, StreamViewType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { PRODUCT_TABLE_NAME } from '../common/ProductConstructNames';
import { AppStack, AppTable } from 'common-aws';
import { generateId } from 'common-utils';

export class ProductTable extends AppTable {
  public static fromStack(stack: AppStack): ITable {
    const name = ProductTable.generateName();

    return ProductTable.fromName(stack, name);
  }

  public static fromName(scope: Construct, name: string): ITable {
    return Table.fromTableAttributes(scope, `${name}-ref-${generateId()}`, {
      tableName: name,
      globalIndexes: []
    });
  }

  public static generateName(): string {
    return PRODUCT_TABLE_NAME;
  }

  public constructor(stack: AppStack) {
    const name = ProductTable.generateName();

    super(stack, name, {
      tableName: name,
      partitionKey: { name: '_key', type: AttributeType.STRING },
      sortKey: { name: '_sortKey', type: AttributeType.STRING },
      stream: StreamViewType.NEW_IMAGE
    });
  }
}
