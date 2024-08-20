export class ProblemSet {
  num!: number;
  title!: string;

  constructor(num: number, title: string) {
    this.num = num;
    this.title = title;
  }

  toString() { 
    return `${this.num.toString().padStart(2,"0")} - ${this.title}`;
  }
  toFilename(ext: string = 'ts') {
    return `${this.num.toString().padStart(2,"0")}-${this.title.toLocaleLowerCase()}.${ext}`;
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