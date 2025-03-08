import {
  dbConfig,
  DynamoDbFactory,
  DynamoDocument,
  DynamoDocumentMapper,
  dynamoRepository,
  DynamoRepository
} from 'common-aws';
import { Product } from '../../core/model/Product';
import { ProductRepository } from '../../core/repository/ProductRepository';

interface ProductRepositoryDeps {
  baseProductRepository: DynamoRepository<ProductDynamoDocument>;
  dynamoDocumentMapper: DynamoDocumentMapper<Product>;
}

export type ProductDynamoDocument = DynamoDocument<Product>;

export const PRODUCT_SORT_KEY = 'Product';
export const PPRODUCT_CURRENT_VERSION = 1;

export const productRepositoryImpl = ({
  baseProductRepository,
  dynamoDocumentMapper
}: ProductRepositoryDeps): ProductRepository => {
  const { mapToDynamoDocument, mapToEntity } = dynamoDocumentMapper.getMappingFunctions(PPRODUCT_CURRENT_VERSION);

  const createOrUpdate = async (product: Product) => {
    const document = mapToDynamoDocument(product);

    await baseProductRepository.createOrUpdate(document);
  };

  const createOrUpdateMany = async (products: Product[]) => {
    const documents = products.map(mapToDynamoDocument);
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

export const createBaseProductRepository = (
  dynamoDbFactory: DynamoDbFactory
): DynamoRepository<ProductDynamoDocument> =>
  dynamoRepository<ProductDynamoDocument>({
    dbConfig,
    dynamoDbFactory,
    key: (p) => p.id,
    sortKey: PRODUCT_SORT_KEY
  });
