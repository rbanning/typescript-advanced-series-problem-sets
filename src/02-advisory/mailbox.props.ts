export type Mailbox = {
  id: number;
  key: string;
}

export type Frequency = {[key: string]: number };

export type DuplicateStats = {
  count: number;
  max?: { key: string, count: number; }
}
