import { ProductLookup } from "./src/00-cart/product.type";
import { arrayHelper } from "./src/array-helper";
import { fetchData } from "./src/fetch-data.utils";
import { ProblemSet, problemSetDone, problemSetHeading } from "./src/problem-set.utils";
import { saveData } from "./src/save-data.utils";

const main = (() => {
  const ps = ProblemSet.current();
  if (!ps) { throw new Error("could not determine problem set"); }

  problemSetHeading(ps);
  work(ps)
    .then(() => problemSetDone());

  
})();

async function work(ps: ProblemSet) {

    
  const { vegetables, fruits } = await loadData();

  const knownVeg: ProductLookup = arrayHelper.randomize(vegetables, 20)
    .reduce((ret, curr) => {
      ret[curr] = Math.floor(Math.random() * 300 + 50) / 100;
      return ret;
    }, {} as ProductLookup);
  const knownFruit: ProductLookup = arrayHelper.randomize(fruits, 20)
    .reduce((ret, curr) => {
      ret[curr] = Math.floor(Math.random() * 300 + 50) / 100;
      return ret;
    }, {} as ProductLookup);

  const products: ProductLookup = {...knownFruit, ...knownVeg};
  let filename = ps.toFilename('.json');

  console.log(`saving ${Object.keys(products).length} known fruit and veg to ${filename}`)

  await saveData(filename, JSON.stringify(products));


  const available = [...Object.keys(products)];
  const discontinued = [...vegetables, ...fruits].filter(m => !available.includes(m));

  const sampleSize = 10000;
  const entries: string[] = [`source,item,qty`];  //start with header
  while (entries.length <= sampleSize) {
    const source = Math.ceil(Math.random() * 5000);
    const qty = Math.ceil(Math.random() * 6);
    const product = arrayHelper.random(Math.random() < 0.05 ? discontinued : available);
    entries.push([source, product, qty].join(','));
  }

  filename = ps.toFilename('.txt');

  console.log(`saving ${entries.length - 1} random sales figures to ${filename}`);

  await saveData(filename, entries.join('\n'));

  return Promise.resolve(true);
}

async function loadData() : Promise<{vegetables: string[], fruits: string[]}> {
  const actions = [
    fetchData('file', 'src/data/vegetables.json'),
    fetchData('file', 'src/data/fruits.json'),
  ];

  const [dataVeg, dataFruits] = await Promise.all(actions);
  const {vegetables} = JSON.parse(dataVeg.join('\n').toLocaleLowerCase());
  const {fruits} = JSON.parse(dataFruits.join('\n').toLocaleLowerCase());

  return { vegetables, fruits };
}