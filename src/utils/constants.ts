import { Filter } from '../types/Filter';
import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

export const USER_ID = 28;

export const FILTERS: Filter[] = [
  {
    type: FilterTypes.All,
    name: 'All',
    cb: () => true,
    hash: '#/',
  },
  {
    type: FilterTypes.Active,
    name: 'Active',
    cb: (todo: Todo) => !todo.completed,
    hash: '#/active',
  },
  {
    type: FilterTypes.Completed,
    name: 'Completed',
    cb: (todo: Todo) => todo.completed,
    hash: '#/completed',
  },
];
