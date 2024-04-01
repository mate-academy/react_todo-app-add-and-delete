import React, { createContext, useCallback, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodosContextType } from '../types/TodosContextType';
import { Status } from '../types/Status';

export const TodosContext = createContext<TodosContextType | undefined>(
  undefined,
);

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleError = useCallback((message: string): undefined => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  const todosState = {
    todos,
    setTodos,
    query,
    setQuery,
    errorMessage,
    setErrorMessage,
    handleError,
    tempTodo,
    setTempTodo,
    editingTodo,
    setEditingTodo,
    loadingTodosIds,
    setLoadingTodosIds,
    isInputFocused,
    setIsInputFocused,
  };

  return (
    <TodosContext.Provider value={todosState}>{children}</TodosContext.Provider>
  );
};
