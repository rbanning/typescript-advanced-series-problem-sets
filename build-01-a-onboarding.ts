import { Mailbox } from "./src/01-onboarding/mailbox.props";
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

  //generate the mailboxes 
  const { wordList } = await loadData();

  const boxes: Mailbox[] = [];

  for(let id=100; id<1000; id++) {
    boxes.push({
      id,
      key: arrayHelper.random(wordList)
    });
  }

  const filename = ps.toFilename('.txt');
  console.log(`saving ${boxes.length} mailbox information to ${filename}`);

  await saveData(filename, boxes.map(b => `${b.id},${b.key}`).join('\n'));

  return true;
}

async function loadData(): Promise<{wordList: string[]}> {
  const actions = [
    fetchData('file', 'src/data/words.json'),
  ];

  const [dataWords] = await Promise.all(actions);
  const {words} = JSON.parse(dataWords.join('\n').toLocaleLowerCase())
  const wordList = Array.isArray(words) 
    ? words.filter((w: string) => w.length > 3)   //only interested in words 4 or more characters long
    : [];
  return { wordList };

}