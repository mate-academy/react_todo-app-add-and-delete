import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`)
    .then(response => {
      if (!response) {
        throw new Error('Something went wrong, my dear');
      }
    });
};

export const addTodo = (userId: number, todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const patchTodo = (todoId: number, data: Partial<Todo>) => {
  const url = `/todos/${todoId}`;

  return client.patch<Todo>(url, data);
};

// export const client = {
//   get: (url) => request(url),
//   post: (url, data) => request(url, 'POST', data),
//   patch: (url, data) => request(url, 'PATCH', data),
//   delete: (url) => request(url, 'DELETE'),
// };
