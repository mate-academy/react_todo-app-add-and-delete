import { FilterStatus } from '../types/FilterStatus';

export const filters = [
  { href: '#/', status: FilterStatus.ALL, data: 'FilterLinkAll' },
  { href: '#/active', status: FilterStatus.ACTIVE, data: 'FilterLinkActive' },
  {
    href: '#/completed',
    status: FilterStatus.COMPLETED,
    data: 'FilterLinkCompleted',
  },
];
