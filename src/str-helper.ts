
export const strHelper = {
  twoDigitOrdinal,
  asCurrency,
  random,
  capitalize,
  first,
  last
} as const;

function twoDigitOrdinal(num: string | number): string {
  return (typeof(num) === 'number' ? num.toString() : num).padStart(2, '0');
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

function capitalize(text: string, firstOnly: boolean = false): string {
  if (text) {
    if (firstOnly) { return text.charAt(0).toLocaleUpperCase() + text.substring(1).toLocaleLowerCase(); }
    //split and capitalize each word
    return text.split(' ').map(word => capitalize(word, true)).join(' ');
  }
  //else
  return text;
}

function first(text: string) {
  if (text) {
    return text.charAt(0);
  }
  //else
  return '';
}
function last(text: string) {
  if (text) {
    return text.charAt(text.length-1);
  }
  //else
  return '';
}