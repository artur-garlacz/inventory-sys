import {
    dbConfig,
    DynamoDbFactory,
    DynamoDocumentMapper,
    dynamoRepository,
    DynamoRepository,
    ExtendedDynamoDocument
} from "common-aws";

import { Product } from "../models/Product";

export interface ProductRepository {
    createOrUpdate(product: Product): Promise<void>;
    createOrUpdateMany(product: Product[]): Promise<void>;
    getById(id: string): Promise<Product>;
}

interface ProductRepositoryDeps {
    baseProductRepository: DynamoRepository<ProductDynamoDocument>;
    dynamoDocumentMapper: DynamoDocumentMapper<Product>;
}

export type ProductDynamoDocument = ExtendedDynamoDocument<Product, ProductDynamoDocumentExtension>;

interface ProductDynamoDocumentExtension {
    _buzzId?: string;
}

export const PRODUCT_SORT_KEY = "Product";
export const PPRODUCT_CURRENT_VERSION = 1;

export const productRepository = ({
    baseProductRepository,
    dynamoDocumentMapper,
}: ProductRepositoryDeps): ProductRepository => {
    const { mapToDynamoDocument, mapToEntity } = dynamoDocumentMapper.getExtendedMappingFunctions(
        PPRODUCT_CURRENT_VERSION,
    );

    const createOrUpdate = async (Product: Product) => {
        const document = mapToDynamoDocument(Product);

        await baseProductRepository.createOrUpdate(document);
    };

    const createOrUpdateMany = async (Products: Product[]) => {
        const documents = Products.map(mapToDynamoDocument);

    };

    const getById = async (id: string): Promise<Product> => {
        const document = await baseProductRepository.getByKey(id, PRODUCT_SORT_KEY);

        if (!document) {
            throw new Error(`Product '${id}' has not been found.`);
        }

        return mapToEntity(document);
    };

    return {
        createOrUpdate,
        getById,
        createOrUpdateMany
    };
};

export const createBaseProductRepository = (dynamoDbFactory: DynamoDbFactory): DynamoRepository<ProductDynamoDocument> =>
    dynamoRepository<ProductDynamoDocument>({
        dbConfig,
        dynamoDbFactory,
        key: (p) => p.id,
        sortKey: PRODUCT_SORT_KEY
    });
