import React, { FC, useMemo, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Props, Value } from './AppTodoContext.types';
import { ErrorType } from '../Error/Error.types';

export const AppTodoContext = React.createContext<Value>({
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  deletingTodoIDs: [],
  setDeletingTodoIDs: () => {},
  errorMessage: 'No error' as ErrorType,
  setErrorMessage: () => {},
});

export const AppTodoProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIDs, setDeletingTodoIDs] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(
    ErrorType.NoError,
  );

  const contextValue = useMemo(() => {
    return {
      todos,
      setTodos,
      tempTodo,
      setTempTodo,
      deletingTodoIDs,
      setDeletingTodoIDs,
      errorMessage,
      setErrorMessage,
    };
  }, [todos, errorMessage, tempTodo, deletingTodoIDs]);

  return (
    <AppTodoContext.Provider value={contextValue}>
      {children}
    </AppTodoContext.Provider>
  );
};
