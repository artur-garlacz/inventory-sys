export interface DbConfig {
    tableName?: string;
}

export const dbConfig: DbConfig = {
    tableName: process.env.TABLE_NAME
};

export const getTableName = (config: DbConfig): string => {
    const { tableName } = config;

    if (!tableName) {
        throw new Error(`Table name must not be empty.`);
    }

    return tableName;
};
