export type ProblemSet = {
  num: number;
  title: string;
}

export function problemSetHeading(ps: ProblemSet) {
  console.log();
  console.log(`Problem Set: ${ps.num.toString().padStart(2,"0")} - ${ps.title}`);
  console.log(`---------------------------------------------`);
}

export function problemSetDone() {
  console.log();
  console.log(`---------------------------------------------`);
  console.log('DONE');
}