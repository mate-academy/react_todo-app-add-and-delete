import { Todo } from '../types/Todo';
import { Filter } from './Filter';

export const filterTodos = (todos: Todo[], filterType: string) => {
  switch (filterType) {
    case Filter.Active:
      return todos.filter(todo => !todo.completed);
    case Filter.Completed:
      return todos.filter(todo => todo.completed);
    case Filter.All:
    default:
      return todos;
  }
};
