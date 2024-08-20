import { strHelper } from './src/str-helper';
import { productNames, products } from "./src/00-cart/product.type";
import { fetchData, RawDataSource } from "./src/fetch-data.utils";
import { ProblemSet, problemSetDone, problemSetHeading } from "./src/problem-set.utils";
import { Cart } from './src/00-cart/cart.type';

const ps = new ProblemSet(0, 'cart');

const main = (() => {

  problemSetHeading(ps);
  work()
    .then(() => problemSetDone());

})();


async function work() {
  //load data
  const data: RawDataSource = await fetchData('file', ps.toFilename('txt'), { removeBlankLines: true });

  const cart: Cart = {
    items: {},
    total: 0
  }

  data.forEach((line, index) => {
    //skip heading
    if (index > 0) {
      const tuple = parseDataLine(line);
      updateCart(cart, tuple[1], tuple[2]);
    }
  });

  displayCart(cart);
}


type DataLineTuple = [delay: number, product: string, qty: number];
function parseDataLine(line: string): DataLineTuple {
  const parts = line.split(',');
  if (parts.length === 3) {
    return [
      parseInt(parts[0]),  //delay
      parts[1],            //product
      parseInt(parts[2]),  //qty
    ]
  }
  //else
  throw new Error(`Error parsing the data... found line with ${parts.length} parts, expecting 3`);
}





function updateCart(cart: Cart, product: string, qty: number) {
  
  if (product in cart.items) {
    cart.items[product].qty += qty;
  }
  else {
    const name: string | null = productNames.includes(product) ? product : null;
    cart.items[product] = {
      qty,
      state: name ? 'available' : 'discontinued'
    };
  }
  //update total
  if (cart.items[product].state === 'available') {
    cart.total += (products[product] * qty);
  }

  return cart;
}

function displayCart(cart: Cart) {
  Object.keys(cart.items).forEach((product, index) => {
    const item = cart.items[product];
    const description = item.state === 'available' ? `@ ${strHelper.asCurrency(products[product])}/ea. = ${strHelper.asCurrency(item.qty * products[product])}` : item.state;
    console.log(`#${index+1}: ${product} x ${item.qty} ${description}`);
  })
  console.log(`==============`);
  console.log(`>> TOTAL: ${strHelper.asCurrency(cart.total)}`);
}