import { strHelper } from './src/str-helper';
import { ProductLookup } from "./src/00-cart/product.type";
import { fetchData, RawDataSource } from "./src/fetch-data.utils";
import { ProblemSet, problemSetDone, problemSetHeading } from "./src/problem-set.utils";
import { Cart } from './src/00-cart/cart.type';


const main = (() => {
  const ps = ProblemSet.current();
  if (!ps) { throw new Error("could not determine problem set"); }

  problemSetHeading(ps);
  work(ps)
    .then(() => problemSetDone());

})();


async function work(ps: ProblemSet) {
  //load products
  const products = await getProductLookup(ps.toFilename('json'));

  //load data
  const data: RawDataSource = await fetchData('file', ps.toFilename('txt'), { removeBlankLines: true });


  console.log(">>> products", Object.keys(products).length);
  console.log(">>> transactions", data.length - 1); //ignore heading

  const cart: Cart = {
    items: {},
    total: 0
  }

  data.forEach((line, index) => {
    //skip heading
    if (index > 0) {
      const tuple = parseDataLine(line);
      updateCart(cart, tuple[1], tuple[2], products);
    }
  });

  displayCart(cart, products);
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



async function getProductLookup(path: string) {
  const data = await fetchData('file', path);
  const products = JSON.parse(data.join(' '));
  return products as ProductLookup;
}

function updateCart(cart: Cart, product: string, qty: number, lookup: ProductLookup) {
  
  if (product in cart.items) {
    cart.items[product].qty += qty;
  }
  else {
    const name: string | null = product in lookup ? product : null;
    cart.items[product] = {
      qty,
      state: name ? 'available' : 'discontinued'
    };
  }
  //update total
  if (cart.items[product].state === 'available') {
    cart.total += (lookup[product] * qty);
  }

  return cart;
}

function displayCart(cart: Cart, lookup: ProductLookup) {
  Object.keys(cart.items).forEach((product, index) => {
    const item = cart.items[product];
    const description = item.state === 'available' ? `@ ${strHelper.asCurrency(lookup[product])}/ea. = ${strHelper.asCurrency(item.qty * lookup[product])}` : item.state;
    console.log(`#${index+1}: ${product} x ${item.qty} ${description}`);
  })
  console.log(`==============`);
  console.log(`>> TOTAL: ${strHelper.asCurrency(cart.total)}`);
}