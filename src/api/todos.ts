import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1517;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`).catch(() => {
    throw new Error('Unable to load todos');
  });
};

// Add more methods here
export const addTodo = (data: Omit<Todo, 'id'>): Promise<Todo> => {
  if (!data.title) {
    return Promise.reject('Title should not be empty');
  }

  return client.post<Todo>(`/todos?userId=${USER_ID}`, data).catch(() => {
    throw new Error('Unable to add a todo');
  });
};

export const deleteTodo = (id: number): Promise<void> => {
  return client.delete(`/todos/${id}?userId=${USER_ID}`).catch(() => {
    throw new Error('Unable to delete a todo');
  });
};
