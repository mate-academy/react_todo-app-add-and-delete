import { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../../types/TodoFilter';

export const useTodos = (todos: Todo[], selectedTodos: TodoFilter) => {
  const filteredTodos = useMemo(() => {
    switch (selectedTodos) {
      case TodoFilter.Active:
        return todos.filter(todo => !todo.completed);

      case TodoFilter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, selectedTodos]);

  return filteredTodos;
};
