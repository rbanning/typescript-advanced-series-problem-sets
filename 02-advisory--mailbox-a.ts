import { Mailbox, Frequency, DuplicateStats } from './src/02-advisory/mailbox.props';
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

  const boxes: Mailbox[] = data.map((line, index) => {
    const parts = line.split(',');
    if (parts.length === 2) {
      return {
        id: parseInt(parts[0]),
        key: parts[1]
      };
    }

    //else
    throw new Error(`Invalid mailbox entry on line ${index}: ${line}`);
  })

  const frequency = boxes.reduce((acc, box) => {

    if (box.key in acc) {
      acc[box.key] += 1;
    }
    else {
      acc[box.key] = 1;
    }

    return acc;
  }, {} as Frequency)

  const stats: DuplicateStats = Object.keys(frequency).reduce((acc, key) => {
    const count = frequency[key];
    if (count > 1) {
      acc.count += 1;
      if (!acc.max || acc.max.count < count) {
        acc.max = { key, count };
      }
    }
    return acc;
  }, {count: 0} as DuplicateStats)



  console.log('>>> Mailboxes Found', boxes.length);
  console.log('>>> Duplicates Found', stats.count);
  console.log('>>> Max', stats.max);
  
  return true;
}
