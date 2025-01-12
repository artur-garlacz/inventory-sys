import middy from '@middy/core';
import { productRoutes } from './productRoutes';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpRouterHandler from '@middy/http-router';

export const appApiLambdaHandler = ({ routes }: { routes: any[] }) =>
  middy<APIGatewayProxyEvent, APIGatewayProxyResult>().use(httpHeaderNormalizer()).handler(httpRouterHandler(routes));

export const productApiLambdaHandler = appApiLambdaHandler({ routes: productRoutes });
