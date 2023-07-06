import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: string) => {
  return client.get<Todo[]>(`?userId=${userId}`);
};

export const postTodos = (
  userId: string,
  newTodo: Omit<Todo, 'id'>,
) => {
  return client.post(`?userId=${userId}`, newTodo);
};

export const deleteTodos = (userId: string, todoId: number) => {
  return client.delete(`/${todoId}?userId=${userId}`);
};

export const patchTodos = (
  todoId: number,
  userId: string,
  currentTodo: Todo,
) => {
  return client.patch(
    `/${todoId}?userId=${userId}`,
    { completed: !currentTodo.completed },
  );
};
