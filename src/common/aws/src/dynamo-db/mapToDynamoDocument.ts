import { Entity } from "common-utils";

import { DynamoDocument } from "./DynamoDocument";

export const mapToDynamoDocument = <T extends Entity>(
    entity: T,
    worker: string,
    version: number | undefined
): DynamoDocument<T> => {
    const { audit } = entity as Partial<Pick<DynamoDocument<T>, "audit">>;

    const timestamp = new Date().toISOString();

    return {
        ...entity,
        _version: version,
        audit:
            audit === undefined
                ? {
                      createdBy: worker,
                      updatedBy: worker,
                      createdDate: timestamp,
                      updatedDate: timestamp
                  }
                : {
                      ...audit,
                      updatedBy: worker,
                      updatedDate: timestamp
                  }
    };
};
