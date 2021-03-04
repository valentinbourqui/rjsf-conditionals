import env from "./env";

export const toArray = (field) => {
  if (Array.isArray(field)) {
    return field;
  } else {
    return [field];
  }
};

export const toError = (message) => {
  if (env.isDevelopment()) {
    throw new ReferenceError(message);
  } else {
    logWarning(message);
  }
};

export const logWarning = (message) => {
  console.warn(message);
};

/**
 * Find relevant schema for the field
 * @returns { field: "string", schema: "object" } relevant field and schema
 */
export const findRelSchemaAndField = (field, schema) => {
  let separator = field.indexOf(".");
  if (separator === -1) {
    return { field, schema };
  }

  let parentField = field.substr(0, separator);
  let refSchema;
  try {
    refSchema = extractRefSchema(parentField, schema);
  } catch (e) {
    refSchema = null;
  }
  if (refSchema) {
    return findRelSchemaAndField(field.substr(separator + 1), refSchema);
  }

  logWarning(`Failed to retrieve nested schema with key ${field}`);
  return { field, schema };
};

export function findRelUiSchema(field, uiSchema) {
  let separator = field.indexOf(".");
  if (separator === -1) {
    return uiSchema;
  }

  let parentField = field.substr(0, separator);
  let refUiSchema = uiSchema[parentField];
  if (!refUiSchema) {
    return uiSchema;
  } else {
    return findRelUiSchema(field.substr(separator + 1), refUiSchema);
  }
}

// json-rules-engine-simplified

export function isRefArray(field, schema) {
  return (
    schema.properties[field] &&
    schema.properties[field].type === "array" &&
    schema.properties[field].items &&
    schema.properties[field].items["$ref"]
  );
}

function fetchSchema(ref, schema) {
  if (ref.startsWith("#/")) {
    return ref
      .substr(2)
      .split("/")
      .reduce((schema, field) => schema[field], schema);
  } else {
    toError(
      "Only local references supported at this point use json-schema-deref"
    );
    return undefined;
  }
}

export function extractRefSchema(field, schema) {
  let { properties } = schema;
  if (!properties || !properties[field]) {
    toError(`${field} not defined in properties`);
    return undefined;
  } else if (properties[field].type === "array") {
    if (isRefArray(field, schema)) {
      return fetchSchema(properties[field].items["$ref"], schema);
    } else {
      return properties[field].items;
    }
  } else if (properties[field] && properties[field]["$ref"]) {
    return fetchSchema(properties[field]["$ref"], schema);
  } else if (properties[field] && properties[field].type === "object") {
    return properties[field];
  } else {
    toError(`${field} has no $ref field ref schema extraction is impossible`);
    return undefined;
  }
}
