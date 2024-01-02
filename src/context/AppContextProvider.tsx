import {
  FC, useState, useEffect, MouseEvent, useMemo,
} from 'react';
import { USER_ID } from '../USER_ID';
import { getTodos } from '../api/todos';
import { Todo, Filter } from '../types';
import { AppContext } from './AppContext';

type Props = React.PropsWithChildren;

export const AppContextProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.all);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFilterChange = (event: MouseEvent<HTMLAnchorElement>) => {
    const { id } = event.target as HTMLAnchorElement;

    if (selectedFilter === id) {
      return;
    }

    setSelectedFilter(id as Filter);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getTodos(USER_ID);

        setTodos(response);
      } catch (error) {
        setErrorMessage('Unable to load todos');
        setShowError(true);
      }
    };

    loadData();

    return () => {
      setShowError(false);
      setErrorMessage('');
    };
  }, []);

  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  }, [showError]);

  const visibleTodos = useMemo(() => {
    let updatedTodos = [...todos];

    if (todos.length) {
      switch (selectedFilter) {
        case Filter.active:
          updatedTodos = updatedTodos.filter(todo => !todo.completed) || [];
          break;
        case Filter.completed:
          updatedTodos = updatedTodos.filter(todo => todo.completed) || [];
          break;
        default:
          break;
      }
    }

    return updatedTodos;
  }, [selectedFilter, todos]);

  const appContextValue = {
    todos,
    setTodos,
    selectedFilter,
    setSelectedFilter,
    showError,
    setShowError,
    errorMessage,
    setErrorMessage,
    visibleTodos,
    handleFilterChange,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      {children}
    </AppContext.Provider>
  );
};
