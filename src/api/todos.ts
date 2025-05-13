import { Todo, EditableField } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2827;

export const method = {
  get: () => {
    return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
  },

  post: (data: Omit<Todo, 'id'>): Promise<Todo> => {
    return client.post(`/todos`, data);
  },

  patch: (data: EditableField, id: number): Promise<Todo> => {
    return client.patch(`/todos/${id}`, data);
  },

  delete: (id: number): Promise<Todo> => {
    return client.delete(`/todos/${id}`);
  },
};
// Add more methods here
