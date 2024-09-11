import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1346;
//1346
export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, {
    title,
    userId,
    completed,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
// Add more methods here
