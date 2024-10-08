import { Mailbox } from './src/01-onboarding/mailbox.props';
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

  //parse the data into Mailbox[] array
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
  
  const unique = boxes.filter(isUnique);

  console.log('>>> Mailboxes Found', boxes.length);
  console.log('>>> Unique Found', unique.length);
  
  return true;
}

function isUnique (mailbox: Mailbox, index: number, allBoxes: Mailbox[]) {
  //are there any other mailboxes that have the same key...
  //or is this is the FIRST mailbox with this key
  return allBoxes.findIndex(box => box.key === mailbox.key) === index;
}

