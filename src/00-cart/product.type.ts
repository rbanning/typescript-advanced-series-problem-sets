export const productNames = ['apple', 'banana', 'orange'];
export type ProductLookup = Record<string, number>;

export const products: ProductLookup = {
  apple: 1.99,
  orange: 1.19,
  banana: .72
} as const;

