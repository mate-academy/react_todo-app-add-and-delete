import React, { useContext, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { getTodos } from '../../api/todos';
import { AppContextType } from '../../types/AppContextType';
import { ErrorTypes } from '../../types/ErrorTypes';
import { userId } from '../../types/Constants';

type Props = {
  children: React.ReactNode,
};

const AppContext = React.createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState('');
  const [processing, setProcessing] = useState<number[]>([]);
  const [editTodoId, setEditTodoId] = useState<number>(-1);

  useEffect(() => {
    setLoading(true);

    getTodos(userId)
      .then(setTodos)
      .catch(() => {
        setErrorType(ErrorTypes.load);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const value = {
    userId,
    todos,
    setTodos,
    todoTitle,
    setTodoTitle,
    filterType,
    setFilterType,
    loading,
    setLoading,
    errorType,
    setErrorType,
    processing,
    setProcessing,
    editTodoId,
    setEditTodoId,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error('AppContext is not exist');
  }

  return appContext;
}
