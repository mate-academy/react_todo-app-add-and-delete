import { Status } from '../../../../libs/enums';
import { Filter } from '../../../../libs/types';

export const filters: Filter[] = [
  {
    title: 'All',
    hash: Status.all,
    dataCy: 'FilterLinkAll',
  },
  {
    title: 'Active',
    hash: Status.active,
    dataCy: 'FilterLinkActive',
  },
  {
    title: 'Completed',
    hash: Status.completed,
    dataCy: 'FilterLinkCompleted',
  },
];
