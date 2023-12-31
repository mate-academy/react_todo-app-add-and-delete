import {
  ReactNode, createContext, useCallback, useContext, useMemo, useState,
} from 'react';
import { Todo } from './types/Todo';

export const TodoContext = createContext<{
  allTodos: Todo[] | null,
  setAllTodos:(todo: Todo[]) => void,
  visibleTodos: Todo[] | null,
  setVisibleTodos:(todo: Todo[] | null) => void,
  activeFilter: string,
  setActiveFilter:(filter: string) => void,
  handleTodosFilter: (filter: string) => void,
} | null>(null);

export const TodoProvider:
React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allTodos, setAllTodos] = useState<Todo[] | null>(null);
  const [visibleTodos, setVisibleTodos] = useState<Todo[] | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const handleTodosFilter = useCallback((filter: string) => {
    setActiveFilter(filter);

    if (!allTodos) {
      return;
    }

    let filteredTodos = [...allTodos];

    switch (filter) {
      case 'Active':
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
        break;
      case 'Completed':
        filteredTodos = filteredTodos.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    setVisibleTodos(filteredTodos);
  }, [allTodos]);

  const value = useMemo(() => {
    return {
      allTodos,
      setAllTodos,
      visibleTodos,
      setVisibleTodos,
      activeFilter,
      setActiveFilter,
      handleTodosFilter,
    };
  }, [activeFilter, allTodos, handleTodosFilter, visibleTodos]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('No context provided');
  }

  return context;
};
