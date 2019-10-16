export class Map {
  constructor(set: Array<any>): any;

  static size: number;

  clear(): void;
  delete(key: string): void;
  entries(): Array<any>void;
  forEach(callbackfn: (value: any, key: string, object: any) => void, thisArg: any): void;
  get(key: string): any;
  has(key: string): boolean;
  keys(): Array<string>;
  set(key: string, value: any);
  values(): Array<any>;
};
