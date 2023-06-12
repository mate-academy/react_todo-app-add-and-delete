export enum FilterType {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export type FilterTypeKey = keyof typeof FilterType;
