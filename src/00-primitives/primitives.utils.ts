export const primitives = {
  isNullish,
  isString,
  isNumber,
  isBoolean,
} as const;


function isNullish(value: unknown): value is null | undefined {
  return (value === null || typeof(value) === 'undefined');
}

function isString(value: unknown): value is string {
  return typeof(value) === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof(value) === 'number';
}

function isBoolean(value: unknown): value is boolean {
  return typeof(value) === 'boolean';
}

