import { apiLambdaHandler } from 'common-aws';
import { productRoutes } from '../products/api/productRoutes';

export const inventoryApiLambdaHandler = apiLambdaHandler({ routes: productRoutes });
