import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const getFilteredTodo = (
  todos: Todo[],
  filteredType: FilterType,
): Todo[] => (
  todos.filter(todo => {
    switch (filteredType) {
      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      case FilterType.All:
      default:
        return todo;
    }
  }));

export const getNotCompletedTodoNumber = (todos: Todo[]) => {
  return todos.filter(todo => !todo.completed).length;
};

export const getCompletedTodoNumber = (todos: Todo[]) => {
  return todos.filter(todo => todo.completed).length;
};
