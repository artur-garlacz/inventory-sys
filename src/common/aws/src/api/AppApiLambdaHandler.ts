import middy from '@middy/core';
import httpCorsMiddleware from '@middy/http-cors';
import httpErrorHandlerMiddleware from '@middy/http-error-handler';
import httpResponseSerializerMiddleware from '@middy/http-response-serializer';
import httpUrlencodePathParametersParserMiddleware from '@middy/http-urlencode-path-parser';
import httpHeaderNormalizerMiddleware from '@middy/http-header-normalizer';
import httpJsonBodyParserMiddleware from '@middy/http-json-body-parser';
import httpRouterHandler from '@middy/http-router';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const apiLambdaHandler = ({ routes }: { routes: any[] }) =>
  middy<APIGatewayProxyEvent, APIGatewayProxyResult>().use(httpHeaderNormalizer()).handler(httpRouterHandler(routes));
// .use(httpUrlencodePathParametersParserMiddleware())
// .use(httpJsonBodyParserMiddleware())
// .use(httpErrorHandlerMiddleware())
// .use(
//   httpResponseSerializerMiddleware({
//     serializers: [
//       {
//         regex: /^application\/json$/,
//         serializer: ({ body }) => body
//       }
//     ],
//     defaultContentType: 'application/json'
//   })
// );
// .use(httpCorsMiddleware());
