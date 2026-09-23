export type FilterBy = 'all' | 'active' | 'completed';

export type FilterItem = {
  value: FilterBy;
  title: string;
  href: string;
};
