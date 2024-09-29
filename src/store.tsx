import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import React, { useEffect, useMemo, useReducer, useState } from 'react';

type ErrorProps = {
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorContext = React.createContext<ErrorProps>({
  errorMessage: '',
  setErrorMessage: () => {},
});

type FilterProps = {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
};

export const FilterContext = React.createContext<FilterProps>({
  filter: 'All',
  setFilter: () => {},
});

type InitialTodosProps = {
  initialTodos: Todo[];
  setInitialTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const InitialTodosContext = React.createContext<InitialTodosProps>({
  initialTodos: [],
  setInitialTodos: () => {},
});

type TodosContextProps = {
  todos: Todo[];
  dispatch: React.Dispatch<any>;
};

export const TodosContext = React.createContext<TodosContextProps>({
  todos: [],
  dispatch: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const todoReducer = (
  state: Todo[],
  action: { type: string; payload?: any },
) => {
  switch (action.type) {
    case 'SET_TODOS':
      return action.payload;
    case 'ALL':
      return action.payload;
    case 'COMPLETED':
      return action.payload.filter((todo: Todo) => todo.completed);
    case 'ACTIVE':
      return action.payload.filter((todo: Todo) => !todo.completed);
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'REMOVE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [initialTodos, setInitialTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    getTodos()
      .then(fetchedTodos => {
        dispatch({ type: 'SET_TODOS', payload: fetchedTodos });
        setInitialTodos(fetchedTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  const valueTodos = useMemo(
    () => ({
      todos,
      dispatch,
    }),
    [todos],
  );
  const valueInitialTodos = useMemo(
    () => ({
      initialTodos,
      setInitialTodos,
    }),
    [initialTodos],
  );
  const valueFilter = useMemo(
    () => ({
      filter,
      setFilter,
    }),
    [filter],
  );
  const valueError = useMemo(
    () => ({
      errorMessage,
      setErrorMessage,
    }),
    [errorMessage],
  );

  return (
    <TodosContext.Provider value={valueTodos}>
      <InitialTodosContext.Provider value={valueInitialTodos}>
        <FilterContext.Provider value={valueFilter}>
          <ErrorContext.Provider value={valueError}>
            {children}
          </ErrorContext.Provider>
        </FilterContext.Provider>
      </InitialTodosContext.Provider>
    </TodosContext.Provider>
  );
};
