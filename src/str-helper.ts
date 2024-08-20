
export const strHelper = {
  asCurrency,
  random
} as const;

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

function random(size: number, inclMixedCase: boolean, inclDigits: boolean) {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  let ret: string = '';
  while (ret.length < size) {
    const source = (inclDigits && Math.random() < .4) ? digits : letters;
    const ch = source.charAt(Math.floor(Math.random() * source.length));
    ret += (inclMixedCase && Math.random() < .5) ? ch.toLocaleUpperCase() : ch;
  }
  return ret;
}