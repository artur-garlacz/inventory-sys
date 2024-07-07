export interface QueryHandler<TRequest, TResponse> {
  handleAsync(query?: TRequest): Promise<TResponse>;
}

export interface GetProductsQuery {}
export interface GetProductsResponse {}

export type GetProductsQueryHandler = QueryHandler<GetProductsQuery, GetProductsResponse>;

interface GetProductsQueryHandlerDeps {}

export const getProductsQueryHandler = ({}: GetProductsQueryHandlerDeps): GetProductsQueryHandler => {
  const handleAsync = async ({}: GetProductsQuery): Promise<GetProductsResponse> => {
    console.log('Test!!!');

    return { items: [], itemsCount: 13 };
  };

  return {
    handleAsync
  };
};
