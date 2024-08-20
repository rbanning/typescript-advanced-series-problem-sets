import { fetchData, RawDataSource } from "./src/fetch-data.utils";
import { ProblemSet, problemSetDone, problemSetHeading } from "./src/problem-set.utils";


const main = (() => {
  const ps = ProblemSet.current();
  if (!ps) { throw new Error("could not determine problem set"); }

  problemSetHeading(ps);
  work(ps)
    .then(() => problemSetDone());

})();


async function work(ps: ProblemSet) {
  //load data
  const data: RawDataSource = await fetchData('file', ps.toFilename('txt'), { removeBlankLines: true });

  data.forEach((line, index) => {
    console.log(">>>", index, line);
  })
}