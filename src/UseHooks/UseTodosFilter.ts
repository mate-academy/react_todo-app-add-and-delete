import { useState } from 'react';
import { FilterType, FilterTypeValues } from '../types/FilterType';
import { Todo } from '../types/Todo';
import { getVisibleTodos } from '../utils/GetTodos';

export function useTodosFilter(todos: Todo[]) {
  const [filter, setFilter] = useState<FilterTypeValues>(FilterType.All);

  const visibleTodos: Todo[] = getVisibleTodos(todos, filter);

  const countOfActiveTodos = todos.filter(todo => !todo.completed).length;

  return { visibleTodos, filter, setFilter, countOfActiveTodos };
}
