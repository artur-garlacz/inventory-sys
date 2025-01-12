import { asFunction } from "awilix";

import { getDefaultSchemaValidator } from "./getDefaultSchemaValidator";

export const schemaValidatorDependencies = {
    schemaValidator: asFunction(getDefaultSchemaValidator).singleton()
};
