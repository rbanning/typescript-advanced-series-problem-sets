import { strHelper } from './str-helper';
import { Nullable } from './00-primitives/nullable.type';
import path from 'path';

const problemSetParts = ['a', 'b', 'c', 'd', 'e'] as const;
export type ProblemSetPart = typeof problemSetParts[number];

export class ProblemSet {
  lesson: string;
  num: number;
  title: string;
  part: Nullable<ProblemSetPart>;

  constructor(num: number, lesson: string, title: string, part?: Nullable<ProblemSetPart>) {
    this.lesson = lesson;
    this.num = num;
    this.title = title;
    this.part = part;
  }

  toString() { 
    return [
      this.num.toString().padStart(2,"0"),
      strHelper.capitalize(this.lesson),
      ' ',
      strHelper.capitalize(this.title),
      this.part ?? ''
    ].join('-');
  }
  toFilename(ext: string = 'ts') {
    if (ext.startsWith('.')) { ext = ext.substring(1); }
    return [
      strHelper.twoDigitOrdinal(this.num),
      this.lesson.toLocaleLowerCase(),
      '',
      this.title.toLocaleLowerCase(),
      this.part ?? ''
    ].join('-') + `.${ext}`;
  }

  static current(): ProblemSet | null {
    let error: string | null = null;
    let name: string | null = null;
    if (process.argv.length >= 2) {
      name = path.parse(process.argv[1]).name;
      const parts = (name ?? '').split('--');     //split lesson from ps

      //script prefixed with "build" are used for building datasets for problem sets
      if (parts[0] === 'build') {
        parts.splice(0,1); // remove the "build"
      }
      if (parts.length == 2) {
        const [lessonGroup, psGroup] = parts;
        
        const num = parseInt(lessonGroup.substring(0,2));
        const lesson = lessonGroup.substring(lessonGroup.indexOf('-')+1);

        const title = psGroup.substring(0, psGroup.lastIndexOf('-'));
        const part = strHelper.last(psGroup);

        if (isNaN(num)) { error = "Invalid Lesson number"; }
        else if (!problemSetParts.includes(part as ProblemSetPart)) { error = "Invalid PS part"; }
        
        if (!error) {
          return new ProblemSet(num, lesson, title, part as ProblemSetPart);
        }
      }
      else { error = `Expecting num-part-title`; }
    }
    console.log("Unable to determine problem set from executable's script name", {name, error});
    return null;
  }
}

export function problemSetHeading(ps: ProblemSet) {
  console.log();
  console.log(`Lesson #${strHelper.twoDigitOrdinal(ps.num)} ${strHelper.capitalize(ps.lesson)} -- ${strHelper.capitalize(ps.title)} (${ps.part})`);
  console.log(`---------------------------------------------`);
}

export function problemSetDone() {
  console.log(`---------------------------------------------`);
  console.log('DONE');
  console.log();
}