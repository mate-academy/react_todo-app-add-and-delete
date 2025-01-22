import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2228;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const createTodo = ({
  title,
  completed,
}: Omit<Todo, 'id' | 'userId'>) => {
  return client.post<Todo>(`/todos`, { title, completed, userId: USER_ID });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
