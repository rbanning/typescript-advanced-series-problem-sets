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

  test("roger");
  test(30);
  test({ name: "roger", age: 30 });
  test(null);

}

function test(param: string | number | object | null) {
  if (param instanceof String) {
    console.log(">>> string", param);
  }
  else if (param instanceof Number) {
    console.log(">>> number", param);
  }
  else if (param instanceof Object) {
    console.log(">>> object", param);
  }
  else if (param === null) {
    console.log(">>> null", param);
  }
  else {
    console.log(">>> unknown", param);
  }

}