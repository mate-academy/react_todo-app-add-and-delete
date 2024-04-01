import { Dispatch, SetStateAction } from 'react';
import { Todo } from './Todo';
import { FilterTodos } from './FilterTodos';
import { Errors } from './Errors';

export type TodoContext = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  activeTodos: Todo[];
  completedTodos: Todo[];
  error: Errors;
  setError: Dispatch<SetStateAction<Errors>>;
  filterSelected: FilterTodos;
  setFilterSelected: Dispatch<SetStateAction<FilterTodos>>;
  loadingTodoIds: number[];
  setLoadingTodoIds: Dispatch<SetStateAction<number[]>>;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  onDelete: (id: number) => void;
};
