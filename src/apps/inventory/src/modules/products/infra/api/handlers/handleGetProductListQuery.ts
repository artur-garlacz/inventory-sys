import { getProductListQueryHandler } from '../../app/get-products/GetProductListQueryHandler';

export const handleGetProductListQuery = async (event: any, context: any) => {
  console.log('event', event);
  console.log('context', context);

  const body = await getProductListQueryHandler().handleAsync({});

  return {
    statusCode: 200,
    body: JSON.stringify(body)
  };
};
