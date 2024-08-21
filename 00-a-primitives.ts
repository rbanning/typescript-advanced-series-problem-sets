import { Nullable } from "./src/00-primitives/nullable.type";
import { primitives } from "./src/00-primitives/primitives.utils";
import { fetchData, RawDataSource } from "./src/fetch-data.utils";
import { ProblemSet, problemSetDone, problemSetHeading } from "./src/problem-set.utils";


const main = (() => {
  const ps = ProblemSet.current();
  if (!ps) { throw new Error("could not determine problem set"); }

  problemSetHeading(ps);
  work(ps)
    .then(() => problemSetDone());

})();


type PossibleDataType = Nullable<string | number | boolean>;

type Counter = {
  nullish: number,
  string: number,
  number: number,
  boolean: number,
  other: number,
}
const defaultCounter: Counter = {
  nullish: 0,
  string: 0,
  number: 0,
  boolean: 0,
  other: 0
};



async function work(ps: ProblemSet) {
  //load the json data file
  const raw: RawDataSource = await fetchData('file', ps.toFilename('json'), { removeBlankLines: true });
  const data = JSON.parse(raw.join(' ')) as PossibleDataType[]; 
  //data could be of type unknown[], but this causes a problem when using .reduce() 
  // see https://github.com/microsoft/TypeScript/issues/42201

  const counter = data.reduce((ret, curr) => {
    if (primitives.isNullish(curr)) { ret.nullish += 1; }
    else if (primitives.isString(curr)) { ret.string += 1; }
    else if (primitives.isNumber(curr)) { ret.number += 1; }
    else if (primitives.isBoolean(curr)) { ret.boolean += 1; }
    else { ret.other += 1; }

    return ret;
  }, defaultCounter);


  Object.keys(counter).forEach(key => {
    console.log(`>>> ${key}`, counter[key as keyof Counter]);
  });

}