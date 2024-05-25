import React, { createContext, useContext } from 'react';
import { UseTodos, useTodos } from '../hooks/useTodos';
import { temporaryTodo } from '../utils/tempTodo';

interface TodosProviderProps {
  children: React.ReactNode;
}

const initialContextValue: UseTodos = {
  todos: [],
  setTodos: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  tempTodo: temporaryTodo,
  setTempTodo: () => {},
  loadingIds: [],
  setLoadingIds: () => {},
};

const TodosContext = createContext<UseTodos>(initialContextValue);

export const TodosProvider: React.FunctionComponent<TodosProviderProps> = ({
  children,
}) => {
  const todosData = useTodos();

  return (
    <TodosContext.Provider value={todosData}>{children}</TodosContext.Provider>
  );
};

export const useTodosContext = () => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('');
  }

  return context;
};
