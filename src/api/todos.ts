import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const postTodo = ({
  id, title, completed, userId,
}: Todo) => {
  return client.post<Todo>('/todos', {
    id, title, completed, userId,
  });
};
