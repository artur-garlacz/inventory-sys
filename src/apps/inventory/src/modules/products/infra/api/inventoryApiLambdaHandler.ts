import { apiLambdaHandler } from 'common-aws';
import { productRoutes } from './productRoutes';

export const productApiLambdaHandler = apiLambdaHandler({ routes: productRoutes });
