import { Todo } from '../types/Todo';

export enum StatusValue {
  ALL,
  ACTIVE,
  COMPLETED,
}

export const visibleTodos = (todos: Todo[], statusTodo: StatusValue) => {
  return todos.filter(todo => {
    switch (statusTodo) {
      case StatusValue.ALL:
        return todo;

      case StatusValue.ACTIVE:
        return todo.completed === false;

      case StatusValue.COMPLETED:
        return todo.completed === true;

      default:
        throw new Error(`Wrong filter, ${statusTodo} is not defined`);
    }
  });
};

export const getCompletedTodosIds = (todos: Todo[]) => {
  return todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);
};
