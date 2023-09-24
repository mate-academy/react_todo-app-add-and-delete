import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const removeTodo = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const updateTodo = (todo: Todo) => {
  return client.patch(`/todos/${todo.id}`, todo);
};
