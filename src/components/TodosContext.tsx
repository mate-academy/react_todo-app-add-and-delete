import React from 'react';
import { Todo } from '../types/Todo';
import { TodosFilter } from '../types/TodosFilter';
import { TodoFromServer } from '../types/TodoFromServer';

type Props = {
  DEFAULT_DATA: TodoFromServer,
  todosAfterFiltering: Todo[],
  todos: Todo[],
  todoEditIsLoading: Todo | null,
  todosFilter: TodosFilter,
  todoEditTitle: string,
  todoEditId: number,
  todoIsLoading: number | null,
  errorMessage: string,
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  setTodos: (todos: (prev: Todo[]) => Todo[]) => void,
  setTodosFilter: (filter: TodosFilter) => void,
  setTodoEditTitle: (id: string) => void,
  setErrorMessage: (id: string) => void,
  setTodoEditId: (id: number) => void,
  setTodoIsLoading: (id: (number | null)) => void,
  setTodoEditIsLoading: (todo: Todo | null) => void,
};
export const TodosContext = React.createContext<Props>({
  DEFAULT_DATA: {
    userId: -1,
    title: '',
    completed: false,
  },
  todosAfterFiltering: [],
  todos: [],
  todoEditIsLoading: null,
  todosFilter: TodosFilter.all,
  todoEditTitle: '',
  todoEditId: 0,
  todoIsLoading: null,
  errorMessage: '',
  inputRef: { current: null },
  setTodos: () => {},
  setErrorMessage: () => {},
  setTodosFilter: () => {},
  setTodoEditTitle: () => {},
  setTodoEditId: () => {},
  setTodoIsLoading: () => {},
  setTodoEditIsLoading: () => {},
});
