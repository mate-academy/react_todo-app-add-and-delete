import { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { TodosFilters } from '../../types/TodosFilters';

export const useTodos = (todos: Todo[], selectedTodos: TodosFilters) => {
  const filteredTodos = useMemo(() => {
    switch (selectedTodos) {
      case TodosFilters.Active:
        return todos.filter(todo => !todo.completed);

      case TodosFilters.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, selectedTodos]);

  return filteredTodos;
};
