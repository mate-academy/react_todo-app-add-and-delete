import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4496;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({
  title,
}: Omit<Todo, 'id' | 'completed' | 'userId'>) => {
  return client.post<Todo>(`/todos`, {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
