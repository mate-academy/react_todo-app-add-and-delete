import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

export const USER_ID = 28;

export const FILTERS: Filter[] = [
  {
    name: 'All',
    fn: () => true,
    hash: '#/',
  },
  {
    name: 'Active',
    fn: ({ completed }: Todo) => !completed,
    hash: `#/active`,
  },
  {
    name: 'Completed',
    fn: ({ completed }: Todo) => completed,
    hash: `#/completed`,
  },
];
