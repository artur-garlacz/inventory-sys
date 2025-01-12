// import * as middy from '@middy/core';
import httpRouterHandler from '@middy/http-router';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// export const appApiLambdaHandler = ({ routes }: { routes: any[] }) =>
//   middy
//     .default<APIGatewayProxyEvent, APIGatewayProxyResult>()
//     .use(httpHeaderNormalizer())
//     .handler(httpRouterHandler(routes));
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
