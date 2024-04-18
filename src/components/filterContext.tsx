/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useMemo, useState } from 'react';
import { FilterStatuses } from '../data/enums';
import { TodosContext } from './todosContext';
import { Todo } from '../types/Todo';

type FilterContextType = {
  selectedFilter: string;
  setSelectedFilter: (_selectedFilter: FilterStatuses) => void;
  getFilteredTodos: (status: string) => Todo[];
};

export const FilterContext = React.createContext<FilterContextType>({
  selectedFilter: 'All',
  setSelectedFilter: (_selectedFilter: FilterStatuses) => {},
  getFilteredTodos: (_status: string) => [],
});

type PropsCompleted = {
  children: React.ReactNode;
};

export const FilterProvider: React.FC<PropsCompleted> = ({ children }) => {
  const [selectedFilter, setSelectedFilter] = useState(FilterStatuses.All);
  const { todos } = useContext(TodosContext);

  const getFilteredTodos = (status: string) => {
    switch (status) {
      case 'All':
        return todos;
      case 'Active':
        return todos.filter(todo => !todo.completed);
      case 'Completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const value = useMemo(
    () => ({
      selectedFilter,
      setSelectedFilter,
      getFilteredTodos,
    }),
    [selectedFilter, setSelectedFilter],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
