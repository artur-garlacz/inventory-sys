import { AuditInfo } from "common-utils";

export type DynamoDocument<T> = T & {
    _version?: number;
    audit: AuditInfo;
};

export type ExtendedDynamoDocument<T, TDocExtension> = DynamoDocument<T> & TDocExtension;
