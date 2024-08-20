
export const strHelper = {
  asCurrency
}

function asCurrency(value: number, currency: string = 'USD'): string {
  if (typeof(value) === 'number') {
    return isNaN(value) ? '(invalid)' : new Intl.NumberFormat("en-US", { style: 'currency', currency: currency }).format(value);
  }
  else if (typeof(value) === 'string') {
    return asCurrency(parseFloat(value), currency);
  }
  //else
  return '(unknown)';
}