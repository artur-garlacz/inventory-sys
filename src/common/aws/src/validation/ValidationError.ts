import { ValidationFailure, ValidationResult } from "./ValidationResult";

export interface ValidationError extends Error {
    failures: ValidationFailure[];
}

interface ValidationErrorConstructor extends ErrorConstructor {
    (message?: string): ValidationError;
    readonly prototype: ValidationError;
    new (message?: string): ValidationError;
}

declare const ValidationError: ValidationErrorConstructor;

export const validationError = (result: ValidationResult): Error => {
    const error: ValidationError = {
        name: "Validation error",
        message: "One or more validation errors occured",
        failures: result.failures
    };

    return new Error(JSON.stringify(error.failures));
};
