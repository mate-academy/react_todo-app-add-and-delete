import { OPTIONS_TODOS } from '../constans';
import { Todo } from '../types/Todo';

export const getTodosByOptions = (option: string, todos: Todo[]) => {
  switch (option) {
    case OPTIONS_TODOS.COMPLETED:
      return todos.filter(todo => todo.completed);

    case OPTIONS_TODOS.ACTIVE:
      return todos.filter(todo => !todo.completed);

    default:
      return todos;
  }
};

export const getTodos = {
  active: (todos: Todo[]) => todos.filter(todo => !todo.completed).length,

  isOneCompleted: (todos: Todo[]) => todos.some(todo => todo.completed),

  isEveryCompleted: (todos: Todo[]) => todos.every(todo => todo.completed),

  allCompletedId: (todos: Todo[]) =>
    todos.filter(todo => todo.completed).map(todo => todo.id),
};
