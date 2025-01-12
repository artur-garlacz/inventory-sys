import { ValidationResult } from "./ValidationResult";

export interface Validator<T> {
    validate(query: T): Promise<ValidationResult>;
}
