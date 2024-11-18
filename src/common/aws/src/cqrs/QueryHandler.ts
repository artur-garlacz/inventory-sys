export interface QueryHandler<TRequest, TResponse> {
  handleAsync(query?: TRequest): Promise<TResponse>;
}
