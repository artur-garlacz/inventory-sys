import { Entity } from "common-utils";

import { DynamoDocument } from "./DynamoDocument";

export const mapToEntity = <T extends Entity>(document: DynamoDocument<T>, version?: number): T => {
    if (document._version !== version) {
        throw new Error(
            `Document '${document.id}' has incorrect version '${document._version}'. Database should've been migrated to version '${version}'.`
        );
    }

    const { _version, ...entity } = document;

    return (entity as unknown) as T;
};
