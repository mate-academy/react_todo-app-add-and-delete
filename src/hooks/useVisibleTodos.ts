import { useMemo } from 'react';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const useVisibleTodos = (todos: Todo[], filter: FilterType) =>
  useMemo(() => {
    if (filter === 'active') {
      return todos.filter(todo => !todo.completed);
    }

    if (filter === 'completed') {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }, [todos, filter]);
