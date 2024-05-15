import { FilterLink } from '../types/FilterLink';

export const FILTER_LINKS: FilterLink[] = [
  {
    href: '#/',
    dataCy: 'FilterLinkAll',
    title: 'All',
  },
  {
    href: '#/active',
    dataCy: 'FilterLinkActive',
    title: 'Active',
  },
  {
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
    title: 'Completed',
  },
];
