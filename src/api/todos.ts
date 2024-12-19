import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2131;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const createTodo = (newTodo: Omit<Todo, 'id' | 'userId'>) => {
  return client.post<Todo>(`/todos`, {
    ...newTodo,
    userId: USER_ID,
    completed: false,
  });
};

// Add more methods here
