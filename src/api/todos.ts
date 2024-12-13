import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2038;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const addTodo = ({ title, userId, id, completed }: Todo) => {
  return client.post<Todo[]>(`/todos`, { title, userId, id, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updatedTodo = ({ title, id, completed }: Omit<Todo, 'userId'>) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed });
};
