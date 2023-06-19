import { StatusValue } from '../types/StatusValue';
import { Todo } from '../types/Todo';

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

export const getcompletedTodosIds = (todos: Todo[]) => {
  return todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);
};
