export type FilterStatus = 'All' | 'Active' | 'Completed';

export interface FilterLink {
  id: number;
  title: FilterStatus;
  url: string;
}
