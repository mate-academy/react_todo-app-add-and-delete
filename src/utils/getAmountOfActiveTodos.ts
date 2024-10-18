import { Todo } from '../types/Todo';

export const getAmountOfActiveTodos = (todos: Todo[]) => {
  return todos.reduce((acc, todo) => (!todo.completed ? acc + 1 : acc), 0);
};
