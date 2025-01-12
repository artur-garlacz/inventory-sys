import { AwilixContainer } from 'awilix';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { Schema } from 'zod';

import { requestMapper, RequestMapper } from './RequestMapper';
import { SchemaValidator, ValidationResult, Validator } from '../validation';
import { QueryHandler } from '../cqrs';
import { apiResponse } from './AppApiResponse';

export type QueryHandlerBuilder<TQuery> = {
  withSchemaValidator(schema: Schema<TQuery | undefined>): QueryHandlerBuilder<TQuery>;
  withValidator(validatorName: string): QueryHandlerBuilder<TQuery>;
  withRequestMapping(
    mappingFunc: (request: APIGatewayProxyEvent, mapper: RequestMapper) => TQuery
  ): QueryHandlerBuilder<TQuery>;
  withLogging(): QueryHandlerBuilder<TQuery>;
  build(): (request: APIGatewayProxyEvent) => Promise<APIGatewayProxyEvent>;
};

export const queryHandlerBuilder = <TQuery, TResponse>(
  queryHandlerName: string,
  container: AwilixContainer
): QueryHandlerBuilder<TQuery> => {
  let schemaToValidate: Schema<TQuery> | undefined = undefined;
  let queryValidatorName: string | undefined = undefined;
  let loggingEnabled = false;
  let mappingFunction: (request: APIGatewayProxyEvent, mapper: RequestMapper) => TQuery;

  const withSchemaValidator = (schema: Schema<TQuery>) => {
    schemaToValidate = schema;
    return builder;
  };

  const withLogging = () => {
    loggingEnabled = true;
    return builder;
  };

  const withValidator = (validatorName: string) => {
    queryValidatorName = validatorName;
    return builder;
  };

  const withRequestMapping = (func: (request: APIGatewayProxyEvent, mapper: RequestMapper) => TQuery) => {
    mappingFunction = func;

    return builder;
  };

  const logObject = (text: string, objToLog: ValidationResult | APIGatewayProxyEvent | TQuery | TResponse) => {
    if (loggingEnabled) {
      console.log(`${text}: ${JSON.stringify(objToLog)}`);
    }

    return builder;
  };

  const build =
    () =>
    async (request: APIGatewayProxyEvent): Promise<APIGatewayProxyEvent> => {
      const queryHandler = container.resolve<QueryHandler<TQuery, TResponse>>(queryHandlerName);
      logObject('Proxy event', request);

      let query: TQuery;

      if (mappingFunction) {
        const mapper = requestMapper(request);

        query = mappingFunction(request, mapper);
      } else {
        query = request.queryStringParameters as unknown as TQuery;
      }

      logObject('Query', query);

      if (schemaToValidate) {
        const schemaValidator = container.resolve<SchemaValidator>('schemaValidator');

        const validationResult = await schemaValidator.validate(schemaToValidate, query);

        logObject('Schema validation result', validationResult);

        if (!validationResult.isValid) {
          return apiResponse.badRequest(validationResult);
        }
      }

      if (queryValidatorName) {
        const validator = container.resolve<Validator<TQuery>>(queryValidatorName);

        const validationResult = await validator.validate(query);

        logObject('Validation result', validationResult);

        if (!validationResult.isValid) {
          return apiResponse.badRequest(validationResult);
        }
      }

      const response = await queryHandler.handleAsync(query);

      logObject('Query response', response);

      return apiResponse.ok(response);
    };

  const builder: QueryHandlerBuilder<TQuery> = {
    withRequestMapping,
    withValidator,
    withSchemaValidator,
    withLogging,
    build
  };

  return builder;
};
