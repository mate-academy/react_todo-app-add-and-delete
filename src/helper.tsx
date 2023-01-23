import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

export const getVisibleTodos = (todos: Todo[], filter: Filter) => (
  filter === Filter.all
    ? todos
    : todos.filter(todo => {
      switch (filter) {
        case Filter.active:
          return !todo.completed;

        case Filter.completed:
          return todo.completed;

        default:
          return true;
      }
    })
);
