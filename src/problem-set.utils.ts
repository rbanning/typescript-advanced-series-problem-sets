import path from 'path';

const problemSetParts = ['a', 'b', 'c', 'd', 'e'] as const;
export type ProblemSetPart = typeof problemSetParts[number];

export class ProblemSet {
  num!: number;
  part!: ProblemSetPart;
  title!: string;

  constructor(num: number, part: ProblemSetPart, title: string) {
    this.num = num;
    this.part = part;
    this.title = title;
  }

  toString() { 
    return `${this.num.toString().padStart(2,"0")}-${this.part ?? ''} - ${this.title}`;
  }
  toFilename(ext: string = 'ts') {
    if (ext.startsWith('.')) { ext = ext.substring(1); }
    return `${this.num.toString().padStart(2,"0")}-${this.part ?? ''}-${this.title.toLocaleLowerCase()}.${ext}`;
  }

  static current(): ProblemSet | null {
    let error: string | null = null;
    let name: string | null = null;
    if (process.argv.length >= 2) {
      name = path.parse(process.argv[1]).name;
      const parts = (name ?? '').split('-');

      //script prefixed with "build" are used for building datasets for problem sets
      if (parts[0] === 'build') {
        parts.splice(0,1); // remove the "build"
      }

      if (parts.length >= 3) {
        
        const num = parseInt(parts[0]);
        const part = parts[1];
        const title = parts.slice(2).join('-');

        if (isNaN(num)) { error = "Invalid PS number"; }
        else if (!problemSetParts.includes(part as ProblemSetPart)) { error = "Invalid PS part"; }
        
        if (!error) {
          return new ProblemSet(num, part as ProblemSetPart, title);
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
  console.log(`Problem Set: ${ps.num.toString().padStart(2,"0")} - ${ps.title}`);
  console.log(`---------------------------------------------`);
}

export function problemSetDone() {
  console.log(`---------------------------------------------`);
  console.log('DONE');
  console.log();
}