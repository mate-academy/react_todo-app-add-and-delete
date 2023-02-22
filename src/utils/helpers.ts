import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const getVisibleTodos = (option: Filter, todos: Todo[]) => {
  let filteredTodos = todos;

  if (option === Filter.ACTIVE) {
    filteredTodos = filteredTodos.filter(todo => !todo.completed);
  }

  if (option === Filter.COMPLETED) {
    filteredTodos = filteredTodos.filter(todo => todo.completed);
  }

  return filteredTodos;
};
