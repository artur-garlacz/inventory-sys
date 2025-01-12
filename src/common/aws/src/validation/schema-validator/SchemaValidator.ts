import { Schema } from 'zod';

import { ValidationResult } from '../ValidationResult';

export interface SchemaValidator {
  validate<T>(schema: Schema<T>, validationTarget: T): Promise<ValidationResult>;
}
