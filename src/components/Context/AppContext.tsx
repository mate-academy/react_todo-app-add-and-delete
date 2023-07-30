import React, { useContext, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { getTodos } from '../../api/todos';
import { ContextType } from '../../types/ContextType';

type Props = {
  children: React.ReactNode,
};

const AppContext = React.createContext<ContextType | null>(null);

export const AppProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState('');
  const userId = 11230;

  useEffect(() => {
    setLoading(true);

    getTodos(userId)
      .then(setTodos)
      .catch((error) => {
        setIsError(error);
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
    isError,
    setIsError,
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
