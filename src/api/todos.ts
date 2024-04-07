import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 426;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const createTodo = ({ title }: Pick<Todo, 'title'>) => {
  return client.post<Todo>(`/todos`, {
    userId: USER_ID,
    title,
    completed: false,
  });
};

// Add more methods here
