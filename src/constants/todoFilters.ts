import { FilterItem } from '../types/Filter';

export const todoFilters: FilterItem[] = [
  {
    value: 'all',
    title: 'All',
    href: '#/',
  },
  {
    value: 'active',
    title: 'Active',
    href: '#/active',
  },
  {
    value: 'completed',
    title: 'Completed',
    href: '#/completed',
  },
];
