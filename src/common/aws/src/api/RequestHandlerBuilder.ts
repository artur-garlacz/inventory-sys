import { NameAndRegistrationPair } from 'awilix';

import { AppAwilixContainer } from '../container/AppAwilixContainer';
import { commandHandlerBuilder, CommandHandlerBuilder } from './CommandHandlerBuilder';
import { QueryHandlerBuilder, queryHandlerBuilder } from './QueryHandlerBuilder';

export type RequestHandlerBuilder<TRequest, TRegistrations extends NameAndRegistrationPair<unknown>> = {
  withCommandHandler(commandHandlerName: keyof TRegistrations): CommandHandlerBuilder<TRequest>;
  withQueryHandler(queryHandlerName: keyof TRegistrations): QueryHandlerBuilder<TRequest>;
};

export const requestHandlerBuilder = <TRequest, TRegistrations extends NameAndRegistrationPair<unknown>>(
  container: AppAwilixContainer<TRegistrations>
): RequestHandlerBuilder<TRequest, TRegistrations> => {
  const withCommandHandler = (commandHandlerName: keyof TRegistrations): CommandHandlerBuilder<TRequest> => {
    return commandHandlerBuilder(String(commandHandlerName), container.awilix);
  };

  const withQueryHandler = (queryHandlerName: keyof TRegistrations): QueryHandlerBuilder<TRequest> => {
    return queryHandlerBuilder(String(queryHandlerName), container.awilix);
  };

  return {
    withCommandHandler,
    withQueryHandler
  };
};
