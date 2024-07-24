import { SortType } from '../../enums/SortType';

export const footerOption = [
  {
    sortType: SortType.ALL,
    href: '#/',
    title: 'All',
    dataCY: 'FilterLinkAll',
  },
  {
    sortType: SortType.ACTIVE,
    title: 'Active',
    href: '#/active',
    dataCY: 'FilterLinkActive',
  },
  {
    sortType: SortType.COMPLETED,
    title: 'Completed',
    href: '#/completed',
    dataCY: 'FilterLinkCompleted',
  },
];
