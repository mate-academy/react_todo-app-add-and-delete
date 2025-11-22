import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1296;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = ({ title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, completed, userId: USER_ID });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
