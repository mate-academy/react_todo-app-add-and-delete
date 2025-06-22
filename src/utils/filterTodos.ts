import { FilterType } from '../constants/FilterType';
import { Todo } from '../types/Todo';

export const getActiveTodos = (todos: Todo[]) =>
  todos.filter(todo => !todo.completed);

export const getCompletedTodos = (todos: Todo[]) =>
  todos.filter(todo => todo.completed);

export const filterTodos = (todos: Todo[], filter: string) =>
  todos.filter(todo => {
    return filter === FilterType.All
      ? true
      : filter === FilterType.Active
        ? !todo.completed
        : todo.completed;
  });
