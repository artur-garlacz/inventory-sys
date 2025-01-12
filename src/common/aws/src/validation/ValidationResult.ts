import { ZodError, ZodIssue } from 'zod';

export enum FailureSeverity {
  Error = 1,
  Warning = 2
}

interface ValidationError extends ZodError {}

type ValidationIssueError = ZodIssue;

export interface ValidationFailure {
  code: string;
  message: string;
  severity: FailureSeverity;
}

export type ValidationSuccess = void;

export interface ValidationResult {
  isValid: boolean;
  failures: ValidationFailure[];
}

export const validationSuccessful = (): ValidationResult => {
  return validationResult();
};

export const validationFailed = (failures: ValidationFailure[]): ValidationResult => {
  return validationResult(failures);
};

export const validationResult = (results: (ValidationSuccess | ValidationFailure)[] = []): ValidationResult => {
  return {
    isValid: results.every(isSuccess),
    failures: results.filter(isFailure)
  };
};

const isSuccess = (result: ValidationSuccess | ValidationFailure): result is ValidationSuccess => !result;
const isFailure = (result: ValidationSuccess | ValidationFailure): result is ValidationFailure => !!result;

export const createErrorFailure = (message: string, code = ''): ValidationFailure => {
  return {
    message,
    code,
    severity: FailureSeverity.Error
  };
};

export const createWarningFailure = (message: string, code = ''): ValidationFailure => {
  return {
    message,
    code,
    severity: FailureSeverity.Warning
  };
};

export const mapToValidationResult = (validationError: ValidationError): ValidationResult => {
  return {
    isValid: !validationError,
    failures:
      validationError?.errors.map((error: ValidationIssueError) => {
        return {
          code: error.code,
          message: error.message,
          severity: FailureSeverity.Error
        };
      }) ?? []
  };
};
