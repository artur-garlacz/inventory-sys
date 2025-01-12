import { validateSchema } from '../validateSchema';
import { SchemaValidator } from './SchemaValidator';

export const getDefaultSchemaValidator = (): SchemaValidator => {
  return {
    validate: validateSchema
  };
};
