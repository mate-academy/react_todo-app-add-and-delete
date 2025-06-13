import { useState } from 'react';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';
import { getVisibleTodos } from '../utils/getVisibleTodos';

export function useTodosFilter(todos: Todo[]) {
  const [filter, setFilter] = useState<FilterType>(FilterType.All);

  const visibleTodos: Todo[] = getVisibleTodos(todos, filter);

  const countOfActiveTodos = todos.filter(todo => !todo.completed).length;

  return { visibleTodos, filter, setFilter, countOfActiveTodos };
}
