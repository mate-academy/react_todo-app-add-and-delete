import { useMemo, useState } from 'react';
import { FilterParams } from '../types/FilterParams';
import { Todo } from '../types/Todo';

export const useFilteredTodos = (todos: Todo[]) => {
  const [filter, setFilter] = useState<FilterParams>(FilterParams.All);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterParams.Active:
          return !todo.completed;
        case FilterParams.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filter]);

  return { visibleTodos, filter, setFilter };
};
