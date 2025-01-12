import type { APIGatewayProxyEvent } from 'aws-lambda';

export type RequestMapper = {
  mapToString(value: string | undefined): string;
  mapParamToStringArray(parameterName: string): string[];
  mapParamToNumberArray(parameterName: string): number[];
  mapToNullableNumber(value: string | undefined): number | undefined;
  mapToNumber(value: string | undefined): number;
  mapToNullableBool(value: string | undefined): boolean | undefined;
  mapToNullableDate(value: string | undefined): Date | undefined;
};

export const requestMapper = (request: APIGatewayProxyEvent): RequestMapper => {
  const mapToString = (value: string | undefined) => {
    return value ?? '';
  };

  const mapParamToStringArray = (parameterName: string) => {
    if (!request.queryStringParameters) return [];

    return getValuesFromQueryStringParameterByName(parameterName, request.queryStringParameters);
  };

  const mapParamToNumberArray = (parameterName: string) => {
    return mapParamToStringArray(parameterName).map((value: string) => Number(value));
  };

  const mapToNullableNumber = (value: string | undefined) => {
    if (!value) {
      return undefined;
    }

    return Number(value);
  };

  const mapToNumber = (value: string | undefined) => {
    return Number(value);
  };

  const mapToNullableBool = (value: string | undefined) => {
    return value === undefined ? undefined : value === 'true';
  };

  const mapToNullableDate = (value: string | undefined) => {
    if (!value) {
      return undefined;
    }

    return new Date(value);
  };

  return {
    mapToString,
    mapParamToNumberArray,
    mapParamToStringArray,
    mapToNullableNumber,
    mapToNumber,
    mapToNullableBool,
    mapToNullableDate
  };
};

const getValuesFromQueryStringParameterByName = (
  parameterName: string,
  queryParameters: { [name: string]: string | undefined }
): string[] => {
  const queryParameterNames = Object.keys(queryParameters);

  const matchingNames = queryParameterNames.filter((name: string) => name.match(`^${parameterName}\\.\\d$`));

  return matchingNames.reduce((prev, curr) => {
    const value = queryParameters[curr];
    if (value) {
      prev.push(value);
    }
    return prev;
  }, [] as string[]);
};
