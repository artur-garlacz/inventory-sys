import {
    PutCommandInput,
    GetCommandInput,
    GetCommand,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { DbConfig } from "./DbConfig";
import { DynamoDbFactory } from "./DynamoDbFactory";
import { DynamoDocument } from "./DynamoDocument";

export type DocumentKeys = {
    _key: string;
    _sortKey: string;
};

export type Key = Record<string, any>;

export type BaseDocument<T> = T & DocumentKeys;

export interface DynamoRepositoryDeps<T> {
    dbConfig: DbConfig;
    dynamoDbFactory: DynamoDbFactory;
    key: string | ((entityDynamoDocument: T) => string);
    sortKey: string | ((entityDynamoDocument: T) => string);
}

export interface DynamoRepository<T extends DynamoDocument<unknown>> {
    createOrUpdate(entityDynamoDocument: T): Promise<void>;
//    createOrUpdateMany(entityDynamoDocuments: T[]): Promise<void>;
    getByKey(key: string, sortKey: string): Promise<T | undefined>;
}

export const dynamoRepository = <T extends DynamoDocument<unknown>>({
    dbConfig,
    dynamoDbFactory,
    key: _key,
    sortKey: _sortKey
}: DynamoRepositoryDeps<T>): DynamoRepository<T> => {
    const client = dynamoDbFactory.createDocumentClient();

    const getTableName = (): string => {
        if (!dbConfig.tableName) {
            throw new Error("TABLE_NAME must not be empty.");
        }

        return dbConfig.tableName;
    };

    const getKey = (entityDynamoDocument: T): string => (typeof _key === "string" ? _key : _key(entityDynamoDocument));
    const getSortKey = (entityDynamoDocument: T): string =>
        typeof _sortKey === "string" ? _sortKey : _sortKey(entityDynamoDocument);

    const mapToBaseDocument = (dynamoDocument: T): BaseDocument<T> => ({
        ...dynamoDocument,
        _key: getKey(dynamoDocument),
        _sortKey: getSortKey(dynamoDocument)
    });

    const ensureSortKeyValid = (sortKey: string, key: string) => {
        if (typeof _sortKey === "string" && sortKey !== _sortKey)
            throw new Error(
                `Document '${key}' has incorrect _sortKey '${sortKey}'. Expected _sortKey is '${_sortKey}'`
            );
    };

    const mapToDynamoDocument = (item: Record<string, any>): T => {
        const baseDocument = item as BaseDocument<T>;

        const { _key, _sortKey, ...dynamoDocument } = baseDocument;

        ensureSortKeyValid(String(_sortKey), String(_key));

        return (dynamoDocument as unknown) as T;
    };

    const createOrUpdate = async (entityDynamoDocument: T): Promise<void> => {
        const baseDocument = mapToBaseDocument(entityDynamoDocument);

        const input: PutCommandInput = {
            TableName: getTableName(),
            Item: baseDocument
        };
        const command = new PutCommand(input);

        await client.send(command).catch((e) => {
            throw new Error(`Error during createOrUpdate: ${String(e)}`);
        });
    };

//    const createOrUpdateMany = async (entityDynamoDocuments: T[]): Promise<void> => {
//        const batchSize = 25;
//
//        for (let i = 1; i <= calculateBatchesCount(entityDynamoDocuments.length, batchSize); i++) {
//            const batch = getBatch<T>(entityDynamoDocuments, batchSize, i);
//
//            const input: BatchWriteCommandInput = {
//                RequestItems: {
//                    [getTableName()]: batch.map((batchItem: T) => ({
//                        PutRequest: { Item: mapToBaseDocument(batchItem) }
//                    }))
//                }
//            };
//
//            const command = new BatchWriteCommand(input);
//
//            const result = await client.send(command).catch((e) => {
//                throw new Error(`Error during batchWrite: ${e}`);
//            });
//
//            if (result.UnprocessedItems && Object.keys(result.UnprocessedItems).length > 0) {
//                throw new Error(
//                    `Error during createOrUpdateMany. Unprocessed items ${JSON.stringify(result.UnprocessedItems)}`
//                );
//            }
//        }
//    };

    const getByKey = async (key: string, sortKey: string): Promise<T | undefined> => {
        const input: GetCommandInput = {
            TableName: getTableName(),
            Key: {
                _key: key,
                _sortKey: sortKey
            }
        };

        const command = new GetCommand(input);

        const result = await client.send(command).catch((e) => {
            throw new Error(`Error during getByKey: ${String(e)}`);
        });

        return result.Item ? mapToDynamoDocument(result.Item) : undefined;
    };

    return {
        createOrUpdate,
//        createOrUpdateMany,
        getByKey
    };
};

