export type CartItemState = 'available' | 'discontinued';
export type CartItemMeta = {
  qty: number;
  state: CartItemState;
}
export type CartItems = Record<string, CartItemMeta>;

export type Cart = {
  items: CartItems;
  total: number;
}
