import { Todo } from '../types/Todo';

export const createTitle = (title: string) => {
  const todo: Todo = {
    id: 0,
    userId: 7025,
    title,
    completed: false,
  };

  return todo;
};
