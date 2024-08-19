import { ProblemSet, problemSetDone, problemSetHeading } from "./src/problem-set.utils";

const ps: ProblemSet = {
  num: 0,
  title: 'Title'
}

const main = (() => {

  problemSetHeading(ps);

  //work();

  problemSetDone();
})();
