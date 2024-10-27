import { apiLambdaHandler } from 'common-aws';
import { productRoutes } from './productRoutes';
import middy from '@middy/core';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpRouterHandler from '@middy/http-router';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';

// export const inventoryApiLambdaHandler = async (event: any, context: any): Promise<unknown> => {
//   console.log('event', event);
//   console.log('context', context);
//   return middy().use(httpHeaderNormalizer()).handler(httpRouterHandler(productRoutes));
// };
export const inventoryApiLambdaHandler = apiLambdaHandler({ routes: productRoutes });

// export const inventoryApiLambdaHandler = middy()
//   .use(jsonBodyParser())
//   //   .use(httpSecurityHeaders())
//   .use(httpErrorHandler())
//   //   .use(injectLambdaContext(logger)) // Change to (logger, { logEvent: true }) to log the incoming event
//   .handler(httpRouterHandler(productRoutes));
