import { fetchData, RawDataSource } from "./src/fetch-data.utils";
import { ProblemSet, problemSetDone, problemSetHeading } from "./src/problem-set.utils";

const ps = new ProblemSet(0, 'test');

const main = (() => {

  problemSetHeading(ps);
  work()
    .then(() => problemSetDone());

})();


async function work() {
  //load data
  const data: RawDataSource = await fetchData('file', ps.toFilename('txt'), { removeBlankLines: true });

  data.forEach((line, index) => {
    console.log(">>>", index, line);
  })
}