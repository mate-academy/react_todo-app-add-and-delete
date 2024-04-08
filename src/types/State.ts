import { FilterBy } from '../enums/FilterBy';
import { Todo } from './Todo';

export type State = {
  todos: Todo[];
  sortBy: FilterBy;
  status: string;
};
