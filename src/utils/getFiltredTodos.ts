import { Todo, FilterOption } from '../types';

export const getFilteredTodos = (todos: Todo[], filterOption: FilterOption) => {
  switch (filterOption) {
    case FilterOption.active:
      return todos.filter(todo => !todo.completed);
    case FilterOption.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
