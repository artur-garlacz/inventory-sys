import middy from '@middy/core';
import httpCorsMiddleware from '@middy/http-cors';
import httpErrorHandlerMiddleware from '@middy/http-error-handler';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpHeaderNormalizerMiddleware from '@middy/http-header-normalizer';
import httpJsonBodyParserMiddleware from '@middy/http-json-body-parser';
import httpRouterHandler from '@middy/http-router';

export const apiLambdaHandler = ({ routes }: { routes: any[] }) =>
  middy()
    .handler(httpRouterHandler(routes))
    .use(httpHeaderNormalizer())
    .use(httpHeaderNormalizerMiddleware())
    .use(httpCorsMiddleware())
    .use(httpErrorHandlerMiddleware())
    .use(httpJsonBodyParserMiddleware());
