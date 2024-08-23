import { ParagraphStats } from "./src/00-welcome/paragraph-stats.props";
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

  const delim = {
    sentence: /(\.|\?|\!)/,
    word: /(\s)/,
  } as const;

  const stats = data.reduce((acc, para) => {
    const sentences = para.split(delim.sentence);
    acc.push({
      sentences: sentences.length,
      words: sentences.reduce((sum, sentence) => {
        sum += sentence.trim().split(delim.word).filter(word => /\w+/.test(word)).length;
        return sum;
      }, 0),
    });
    return acc;
  }, [] as ParagraphStats[]);

  stats.forEach((stat, index) => {
    console.log(">>>", index, `sentences: ${stat.sentences}, words: ${stat.words}`);
  })

  return true;
}
