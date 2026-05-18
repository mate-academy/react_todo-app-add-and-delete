import type { FilterBy } from './ErrorMessages';

export type FilterLink = {
  id: number;
  href: string;
  dataCy: string;
  filterBy: FilterBy;
  title: string;
};
