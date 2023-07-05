import { useMemo } from 'react';
import { TodoStatus } from '../types/TodoStatus';
import { Todo } from '../types/Todo';

export const FilterTodos = (todos: Todo[], todoFilter: TodoStatus) => {
  return useMemo(() => (
    todos.filter(todo => {
      switch (todoFilter) {
        case TodoStatus.All:
          return todo;

        case TodoStatus.Active:
          return !todo.completed;

        case TodoStatus.Completed:
          return todo.completed;

        default:
          throw new Error(`${todoFilter} is not defined`);
      }
    })
  ), [todos, todoFilter]);
};
