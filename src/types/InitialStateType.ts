import { Todo } from './Todo';

export type InitialStateType = {
  todos: Todo[];
  itemsLeft: () => number;
  filter: string;
  getVisibleTodos: () => Todo[] | [];
  updatedTodoIds: number[] | [];
  errorMessage: string,
};
