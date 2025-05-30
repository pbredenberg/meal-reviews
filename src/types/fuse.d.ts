declare module 'fuse.js' {
  export default class Fuse<T> {
    constructor(list: readonly T[], options?: Fuse.IFuseOptions<T>);
    search(pattern: string): Array<{ item: T; refIndex: number }>;
  }
  
  namespace Fuse {
    interface IFuseOptions<T> {
      keys?: Array<string | { name: string; weight: number }>;
      id?: string;
      threshold?: number;
      location?: number;
      distance?: number;
      includeScore?: boolean;
      includeMatches?: boolean;
      minMatchCharLength?: number;
      shouldSort?: boolean;
      findAllMatches?: boolean;
      sortFn?: (a: { score: number }, b: { score: number }) => number;
      tokenize?: boolean;
      matchAllTokens?: boolean;
      isCaseSensitive?: boolean;
      ignoreLocation?: boolean;
      useExtendedSearch?: boolean;
    }
  }
}
