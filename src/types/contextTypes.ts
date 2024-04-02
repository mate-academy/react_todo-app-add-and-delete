import { Dispatch, SetStateAction } from 'react';
import { Todo } from './Todo';
import { FilterStatus } from './FilterStatus';

export type TodosContextType = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  filterStatus: FilterStatus;
  setFilterStatus: Dispatch<SetStateAction<FilterStatus>>;
  filteredTodos: Todo[];
  isLoading: boolean;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  isLoadingData: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  selectedTodoIds: number[];
  setSelectedTodoIds: (ids: number[]) => void;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  createNewTodo: (title: string) => void;
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  deleteTodo: (todoId: number) => void;
  clearCompletedTodos: () => void;
};
