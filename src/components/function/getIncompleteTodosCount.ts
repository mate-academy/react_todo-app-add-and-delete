import { Todo } from '../../types/Todo';

export const getIncompleteTodosCount = (todos: Todo[] | null): number => {
  return todos
    ? todos.reduce((count, todo) => (!todo.completed ? count + 1 : count), 0)
    : 0;
};
