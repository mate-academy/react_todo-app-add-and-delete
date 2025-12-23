import { Todo, FilterType } from '../types/Todo';
import { useMemo } from 'react';

export const useFilteredTodos = (todos: Todo[], filter: FilterType) => {
  return useMemo(() => {
    switch (filter) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      case FilterType.All:
      default:
        return todos;
    }
  }, [todos, filter]);
};
