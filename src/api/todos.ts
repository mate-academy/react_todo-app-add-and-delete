import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3089;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = ({ title, userId }: Omit<Todo, 'id' | 'completed'>) => {
  return client.post<Todo>(`/todos`, {
    title,
    userId,
    completed: false,
  });
};

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};
