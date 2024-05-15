import { FC, createContext, useContext, useMemo, useState } from 'react';

import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';
import { TodoContext } from './TodoContext';

export interface IFilterContext {
  filterType: string;
  filteredTodos: Todo[];
  showAllTodos: () => void;
  showCompletedTodos: () => void;
  showActiveTodos: () => void;
}

const initialState: IFilterContext = {
  filterType: 'All',
  filteredTodos: [],
  showAllTodos: () => {},
  showCompletedTodos: () => {},
  showActiveTodos: () => {},
};

export const FilterContext = createContext(initialState);

type TProps = {
  children: React.ReactNode;
};

export const FilterProvider: FC<TProps> = ({ children }) => {
  const { todos } = useContext(TodoContext);

  const [filterType, setFilterType] = useState<string>(FilterType.All);

  const filteredTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);

      default:
        return todos;
    }
  }, [filterType, todos]);

  const value = useMemo(
    () => ({
      filterType,
      filteredTodos,
      showAllTodos: () => setFilterType(FilterType.All),
      showCompletedTodos: () => setFilterType(FilterType.Completed),
      showActiveTodos: () => setFilterType(FilterType.Active),
    }),
    [filterType, filteredTodos],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
