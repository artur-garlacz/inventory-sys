import { AwilixContainer } from 'awilix';
import { ProxyIntegrationEvent, ProxyIntegrationResult } from 'aws-lambda';
import { Schema } from 'zod';

import { requestMapper, RequestMapper } from './RequestMapper';
import { SchemaValidator, ValidationResult, Validator } from '../validation';
import { CommandHandler } from '../cqrs';
import { apiResponse } from './AppApiResponse';

export type CommandHandlerBuilder<TCommand> = {
  withSchemaValidator(schema: Schema<TCommand | undefined>): CommandHandlerBuilder<TCommand>;
  withValidator(validatorName: string): CommandHandlerBuilder<TCommand>;
  withRequestMapping(
    mappingFunc: (request: ProxyIntegrationEvent, mapper: RequestMapper) => TCommand | Partial<TCommand>
  ): CommandHandlerBuilder<TCommand>;
  withLogging(): CommandHandlerBuilder<TCommand>;
  build(): (request: ProxyIntegrationEvent) => Promise<ProxyIntegrationResult>;
};

export const commandHandlerBuilder = <TCommand, TResponse = void>(
  commandHandlerName: string,
  container: AwilixContainer
): CommandHandlerBuilder<TCommand> => {
  let schemaToValidate: Schema<TCommand> | undefined = undefined;
  let commandValidatorName: string | undefined = undefined;
  let loggingEnabled = false;
  let mappingFunction: (request: ProxyIntegrationEvent, mapper: RequestMapper) => TCommand | Partial<TCommand>;

  const withSchemaValidator = (schema: Schema<TCommand>) => {
    schemaToValidate = schema;
    return builder;
  };

  const withLogging = () => {
    loggingEnabled = true;
    return builder;
  };

  const withValidator = (validatorName: string) => {
    commandValidatorName = validatorName;
    return builder;
  };

  const withRequestMapping = (
    func: (request: ProxyIntegrationEvent, mapper: RequestMapper) => TCommand | Partial<TCommand>
  ) => {
    mappingFunction = func;

    return builder;
  };

  const logObject = (text: string, objToLog: ValidationResult | ProxyIntegrationEvent | TCommand | TResponse) => {
    if (loggingEnabled) {
      console.log(`${text}: ${JSON.stringify(objToLog)}`);
    }
    return builder;
  };

  const build =
    () =>
    async (request: ProxyIntegrationEvent): Promise<ProxyIntegrationResult> => {
      const commandHandler = container.resolve<CommandHandler<TCommand, TResponse>>(commandHandlerName);

      logObject('Proxy event', request);

      let command = { ...(request.body as TCommand) };

      if (mappingFunction) {
        const mapper = requestMapper(request);

        command = { ...command, ...mappingFunction(request, mapper) } as TCommand;
      }

      logObject('Command', command);

      if (schemaToValidate) {
        const schemaValidator = container.resolve<SchemaValidator>('schemaValidator');

        const validationResult = await schemaValidator.validate(schemaToValidate, command);

        logObject('Schema validation result', validationResult);

        if (!validationResult.isValid) {
          return apiResponse.badRequest(validationResult);
        }
      }

      if (commandValidatorName) {
        const validator = container.resolve<Validator<TCommand>>(commandValidatorName);

        const validationResult = await validator.validate(command);

        logObject('Validation result', validationResult);

        if (!validationResult.isValid) {
          return apiResponse.badRequest(validationResult);
        }
      }

      const response = await commandHandler.handleAsync(command);

      logObject('Command response', response);

      return apiResponse.ok(response);
    };

  const builder: CommandHandlerBuilder<TCommand> = {
    withRequestMapping,
    withValidator,
    withSchemaValidator,
    withLogging,
    build
  };

  return builder;
};
