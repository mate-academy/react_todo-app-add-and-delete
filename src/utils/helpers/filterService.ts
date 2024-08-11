import { Filters } from '../../types/Filters/Filters';
import { Todo } from '../../types/Todo/Todo';

export const filterTodos = (todos: Todo[], isCompleted: boolean) => {
  return todos.filter(todo => todo.completed === isCompleted);
};

export const getActiveTodos = (todos: Todo[]) => {
  return filterTodos(todos, false);
};

export const getCompletedTodos = (todos: Todo[]) => {
  return filterTodos(todos, true);
};

export const isAllTodosComplete = (todos: Todo[]) => {
  return todos.every(todo => todo.completed === true);
};

export const checkHasCompletedTodo = (todos: Todo[]) => {
  return todos.some(todo => todo.completed);
};

export const getFiltedTodos = (todos: Todo[], filter: Filters): Todo[] => {
  switch (filter) {
    case Filters.Active:
      return getActiveTodos(todos);
    case Filters.Completed:
      return getCompletedTodos(todos);
    default:
      return todos;
  }
};
