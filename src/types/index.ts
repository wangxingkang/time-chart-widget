export interface Bin {
  count: number;
  indexes: number[];
  x0: number;
  x1: number;
}

export interface Bins {
  [dataId: string]: Bin[];
}
