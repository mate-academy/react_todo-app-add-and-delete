import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

// export const client = {
//   get: (url) => request(url),
//   post: (url, data) => request(url, 'POST', data),
//   patch: (url, data) => request(url, 'PATCH', data),
//   delete: (url) => request(url, 'DELETE'),
// };
