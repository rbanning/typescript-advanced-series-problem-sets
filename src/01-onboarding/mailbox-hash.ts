export function mailboxHash(code: string) {
  return (code ?? '').split('').reduce((hash, ch) => {
    return ch.charCodeAt(0) //the character's ascii code
      + (hash << 6)
      + (hash << 16)
      - hash;
  }, 0);
}