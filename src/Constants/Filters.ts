import { Filter } from '../types/Filter';

export const FILTERS: {
  value: Filter;
  label: string;
  href: string;
  dataCy: string;
}[] = [
  { value: Filter.ALL, label: 'All', href: '#/', dataCy: 'FilterLinkAll' },
  {
    value: Filter.ACTIVE,
    label: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    value: Filter.COMPLETED,
    label: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];
