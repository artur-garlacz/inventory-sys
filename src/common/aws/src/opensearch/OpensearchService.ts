import { Construct } from 'constructs';
import {
  CfnAccessPolicy,
  CfnCollection,
  CfnSecurityPolicy,
  CfnVpcEndpoint
} from 'aws-cdk-lib/aws-opensearchserverless';
// import { VpcConstruct } from './vpc';
import { IRole, Role } from 'aws-cdk-lib/aws-iam';

interface OpenSearchServiceProps {
  collectionName: string;
  role: IRole;
}

export class OpenSearchService extends Construct {
  public readonly searchDomain: string;
  public readonly collection: CfnCollection;

  constructor(scope: Construct, id: string, props: OpenSearchServiceProps) {
    super(scope, id);

    this.collection = new CfnCollection(this, props.collectionName, {
      name: props.collectionName,
      type: 'SEARCH'
    });

    const encPolicy = new CfnSecurityPolicy(this, 'MySecurityPolicy', {
      name: `${props.collectionName}-policy`,
      policy: `{"Rules":[{"ResourceType":"collection","Resource":["collection/${props.collectionName}"]}],"AWSOwnedKey":true}`,
      type: 'encryption'
    });
    this.collection.addDependency(encPolicy);

    const netPolicy = new CfnSecurityPolicy(this, 'ProductNetworkPolicy', {
      name: 'my-network-policy',
      policy: JSON.stringify([
        {
          Rules: [
            {
              ResourceType: 'collection',
              Resource: [`collection/${props.collectionName}`]
            },
            {
              ResourceType: 'dashboard',
              Resource: [`collection/${props.collectionName}`]
            }
          ],
          AllowFromPublic: true
        }
      ]),
      type: 'network'
    });
    this.collection.addDependency(netPolicy);

    const dataAccessPolicy = new CfnAccessPolicy(this, 'MyCfnAccessPolicy', {
      name: 'my-data-access-policy',
      type: 'data',
      policy: JSON.stringify([
        {
          Rules: [
            {
              Resource: ['collection/my-collection'],
              Permission: [
                'aoss:CreateCollectionItems',
                'aoss:DeleteCollectionItems',
                'aoss:UpdateCollectionItems',
                'aoss:DescribeCollectionItems'
              ],
              ResourceType: 'collection'
            },
            {
              Resource: ['index/my-collection/*'],
              Permission: [
                'aoss:CreateIndex',
                'aoss:DeleteIndex',
                'aoss:UpdateIndex',
                'aoss:DescribeIndex',
                'aoss:ReadDocument',
                'aoss:WriteDocument'
              ], // TODO: Update this as per the requirement
              ResourceType: 'index'
            }
          ],
          Principal: [
            `arn:aws:iam::*:role/oss-lambda-api-executor-role`,
            props.role.roleArn,
            `arn:aws:iam::*:role/AnyOtherRole`
          ]
        }
      ])
    });
    this.collection.addDependency(dataAccessPolicy);
    this.searchDomain = this.collection.attrCollectionEndpoint;
  }
}
