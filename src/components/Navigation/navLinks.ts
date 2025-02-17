import { Filter } from '../../types';

type NavLink = {
  title: Capitalize<Filter>;
  href: Exclude<Filter, 'all'> | '';
  filter: Filter;
  dataCy: `FilterLink${Capitalize<Filter>}`;
};

export const navLinks: NavLink[] = [
  {
    title: 'All',
    href: '',
    dataCy: 'FilterLinkAll',
    filter: Filter.all,
  },
  {
    title: 'Active',
    href: Filter.active,
    dataCy: 'FilterLinkActive',
    filter: Filter.active,
  },
  {
    title: 'Completed',
    href: Filter.completed,
    dataCy: 'FilterLinkCompleted',
    filter: Filter.completed,
  },
];
