export interface QueryHandler<TRequest, TResponse> {
  handleAsync(query?: TRequest): Promise<TResponse>;
}

export interface GetProductListQuery {}
export interface GetProductListResponse {}

export type GetProductListQueryHandler = QueryHandler<GetProductListQuery, GetProductListResponse>;

// interface GetProductListQueryHandlerDeps {}

export const getProductListQueryHandler = (): GetProductListQueryHandler => {
  const handleAsync = async ({}: GetProductListQuery): Promise<GetProductListResponse> => {
    return { items: [], itemsCount: 13 };
  };

  return {
    handleAsync
  };
};
