import { Todo } from './Todo';

export enum Filter {
  all = 'all',
  completed = 'completed',
  active = 'active',
}

export type TodoFromServer = Todo & {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type State = {
  filter: Filter;
  todos: TodoFromServer[];
};
