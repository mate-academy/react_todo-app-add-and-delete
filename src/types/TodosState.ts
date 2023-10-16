import { Todo } from './Todo';
import { TodosDispatch } from './TodosDispatch';

export type TodosState = [
  todos: Todo[],
  todosDispatch: TodosDispatch,
];
