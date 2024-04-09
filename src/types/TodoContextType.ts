import { Dispatch, SetStateAction } from 'react';
import { Todo } from './Todo';
import { FilterOption } from '../enums/FilterOption';
import { Errors } from '../enums/Errors';

export type TodoContextType = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  preparedTodos: Todo[];
  activeTodos: Todo[];
  completedTodos: Todo[];
  errorMessage: Errors | null;
  setErrorMessage: Dispatch<SetStateAction<Errors | null>>;
  filterBy: FilterOption;
  setFilterBy: Dispatch<SetStateAction<FilterOption>>;
  onTodoDelete: (id: number) => void;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  loadingTodosIds: number[];
  setLoadingTodosIds: Dispatch<SetStateAction<number[]>>;
  inputFocus: boolean;
  setInputFocus: Dispatch<SetStateAction<boolean>>;
};
