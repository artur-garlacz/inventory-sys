export interface CommandHandler<TCommand, TResponse = void> {
    handleAsync(obj: TCommand): Promise<TResponse>;
}
