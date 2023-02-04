import { Todo } from "../types/Todo";

export const normalizeTodos = (todos: Todo[]) => {
  return todos.map(({
    id,
    title,
    completed,
    userId,
  }) => {
    return {
      id,
      userId,
      title,
      completed,
    };
  });
};

