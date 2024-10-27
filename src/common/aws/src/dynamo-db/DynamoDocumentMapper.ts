import { Entity } from "common-utils";

import { DynamoDocument, ExtendedDynamoDocument } from "./DynamoDocument";
import { mapToDynamoDocument } from "./mapToDynamoDocument";
import { mapToEntity } from "./mapToEntity";

type ExecutionContext = any;

export type DynamoDocumentMapper<T extends Entity> = {
    getMappingFunctions(currentVersion: number | undefined): DynamoDocumentMappingFunctions<T>;

    getExtendedMappingFunctions<TDynamoDocExtension>(
        currentVersion: number | undefined,
        mapToDynamoDocExtension?: (entity: T) => TDynamoDocExtension
    ): ExtendedDynamoDocumentMappingFunctions<T, TDynamoDocExtension>;
};

interface DynamoDocumentMappingFunctions<T> {
    mapToDynamoDocument(entity: T): DynamoDocument<T>;
    mapToEntity(document: DynamoDocument<T>): T;
}

interface ExtendedDynamoDocumentMappingFunctions<T, TDynamoDocExtension> {
    mapToDynamoDocument(entity: T): ExtendedDynamoDocument<T, TDynamoDocExtension>;
    mapToEntity(document: ExtendedDynamoDocument<T, TDynamoDocExtension>): T;
}

export interface DynamoDocumentMapperDeps {
    executionContext: ExecutionContext;
}

export const dynamoDocumentMapper = <T extends Entity>({
    executionContext
}: DynamoDocumentMapperDeps): DynamoDocumentMapper<T> => ({
    getMappingFunctions: (currentVersion: number | undefined): DynamoDocumentMappingFunctions<T> => ({
        mapToDynamoDocument: (entity: T): DynamoDocument<T> =>
            mapToDynamoDocument(entity, executionContext.getWorker(), currentVersion),
        mapToEntity: (document: DynamoDocument<T>): T => mapToEntity(document, currentVersion)
    }),

    getExtendedMappingFunctions: <TDynamoDocExtension>(
        currentVersion: number | undefined,
        mapToDynamoDocExtension: (entity: T) => TDynamoDocExtension
    ): ExtendedDynamoDocumentMappingFunctions<T, TDynamoDocExtension> => ({
        mapToDynamoDocument: (entity: T): ExtendedDynamoDocument<T, TDynamoDocExtension> => ({
            ...mapToDynamoDocument(entity, executionContext.getWorker(), currentVersion),
            ...mapToDynamoDocExtension(entity)
        }),
        mapToEntity: (document: ExtendedDynamoDocument<T, TDynamoDocExtension>): T =>
            mapToEntity(document, currentVersion)
    })
});
