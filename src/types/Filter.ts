export enum FILTER {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export type FilterStatus = FILTER.ALL | FILTER.ACTIVE | FILTER.COMPLETED;
