export enum FilterType {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export interface FilterLink {
  name: string;
  value: FilterType;
  href: string;
}
