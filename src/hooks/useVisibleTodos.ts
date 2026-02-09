import { useMemo } from 'react';
import { FilterType, FILTERS } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const useVisibleTodos = (todos: Todo[], filter: FilterType) =>
  useMemo(() => {
    if (filter === FILTERS.active) {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === FILTERS.completed) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }, [todos, filter]);
