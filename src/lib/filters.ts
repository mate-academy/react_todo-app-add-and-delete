import { Filter, FilterTitles } from '../types/Filter';

export const filters: Filter[] = [
  {
    title: FilterTitles.All,
    link: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    title: FilterTitles.Active,
    link: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    title: FilterTitles.Completed,
    link: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];
