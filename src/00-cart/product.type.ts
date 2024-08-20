export const productNames = ['apple', 'banana', 'orange'];
export type Product = Record<string, number>;

export const products: Product = {
  apple: 1.99,
  orange: 1.19,
  banana: .72
} as const;

