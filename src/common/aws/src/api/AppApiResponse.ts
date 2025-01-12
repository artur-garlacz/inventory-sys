import { APIGatewayProxyResult } from 'aws-lambda';

import { ValidationResult } from '../validation/ValidationResult';

export interface AppApiResponse extends APIGatewayProxyResult {
  headers?: ApiResponseHeaders;
}

type ApiResponseHeaders = APIGatewayProxyResult['headers'] & SecurityHeaders;
type SecurityHeaders = Record<SecurityHeaderKey, string>;
type SecurityHeaderKey = (typeof securityHeaderKey)[number];

const securityHeaderKey = [
  'Pragma',
  'Cache-Control',
  'X-Frame-Options',
  'X-Content-Type-Options',
  'Content-Security-Policy',
  'Strict-Transport-Security'
] as const;

const securityHeaders: SecurityHeaders = {
  Pragma: 'no-cache',
  'Cache-Control': 'no-store',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'self'",
  'Strict-Transport-Security': 'max-age=3600'
};

export interface ApiResponseOptions {
  secure: boolean;
}

export const apiResponse = (() => {
  const ok = (body?: unknown, options?: ApiResponseOptions) => {
    return createApiResponse(200, body, options);
  };

  const accepted = (body?: unknown, options?: ApiResponseOptions) => {
    return createApiResponse(202, body, options);
  };

  const noContent = (options?: ApiResponseOptions) => {
    return createApiResponse(204, undefined, options);
  };

  const badRequest = (body?: ValidationResult, options?: ApiResponseOptions) => {
    return createApiResponse(400, body, options);
  };

  const unauthorized = (options?: ApiResponseOptions) => {
    return createApiResponse(401, undefined, options);
  };

  const forbidden = (options?: ApiResponseOptions) => {
    return createApiResponse(403, undefined, options);
  };

  const internalServerError = (error: unknown, options?: ApiResponseOptions) => {
    return createApiResponse(500, error, options);
  };

  return {
    ok,
    accepted,
    noContent,
    badRequest,
    unauthorized,
    forbidden,
    internalServerError
  };
})();

const createApiResponse = (
  statusCode: number,
  body: unknown,
  options: ApiResponseOptions = { secure: true }
): AppApiResponse => ({
  statusCode,
  body: parseUnknownToString(body),
  headers: options.secure ? securityHeaders : undefined
});

const parseUnknownToString = (value?: unknown): string => {
  if (value === undefined || value === null) {
    return JSON.stringify({});
  }

  if (value instanceof Error) {
    return JSON.stringify({
      name: value.name,
      message: value.message,
      stack: value.stack
    });
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
    return String(value);
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  throw new Error(`Type '${typeof value}' cannot be converted to response body.`);
};
