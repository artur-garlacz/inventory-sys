import { DynamoDB, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export interface DynamoDbFactory {
    createDocumentClient(): DynamoDBDocumentClient;
    createDynamoDb(): DynamoDBClient;
}

export interface DynamoDbFactoryDeps {
}

export const dynamoDbFactory = ({ }: DynamoDbFactoryDeps): DynamoDbFactory => {
    const createDocumentClient = () => {
        return DynamoDBDocumentClient.from(createDynamoDb(), {
            marshallOptions: { removeUndefinedValues: true }
        });
    };

    const createDynamoDb = () => {
        return new DynamoDB();
    };

    return {
        createDocumentClient,
        createDynamoDb
    };
};
