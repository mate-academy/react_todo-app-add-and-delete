import {
  FC, useState, useEffect, MouseEvent,
} from 'react';
import { USER_ID } from '../USER_ID';
import { getTodos } from '../api/todos';
import { Todo, Filter } from '../types';
import { AppContext } from './AppContext';

type Props = React.PropsWithChildren;

export const AppContextProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>('All');
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

  let filteredTodos = [...todos];

  if (todos.length) {
    switch (selectedFilter) {
      case 'Active':
        filteredTodos = filteredTodos.filter(todo => !todo.completed) || [];
        break;
      case 'Completed':
        filteredTodos = filteredTodos.filter(todo => todo.completed) || [];
        break;
      default:
        break;
    }
  }

  const appContextValue = {
    todos,
    setTodos,
    selectedFilter,
    setSelectedFilter,
    showError,
    setShowError,
    errorMessage,
    setErrorMessage,
    filteredTodos,
    handleFilterChange,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      {children}
    </AppContext.Provider>
  );
};
