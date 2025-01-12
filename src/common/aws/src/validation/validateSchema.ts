import { Schema } from 'zod';

import { mapToValidationResult, ValidationResult } from './ValidationResult';

export const validateSchema = async <T>(
  schema: Schema<T | undefined>,
  validationTarget: T
): Promise<ValidationResult> => {
  return schema
    .parseAsync(validationTarget, { async: true })
    .then(() => ({ isValid: true, failures: [] }))
    .catch(mapToValidationResult);
};
