import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3271;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (title: string) => {
  const data = {
    title,
    userId: USER_ID,
    completed: false,
  };

  return client.post<Todo>(`/todos`, data);
};

export const deleteTodo = async (todoId: number): Promise<boolean> => {
  await client.delete(`/todos/${todoId}`);

  return true;
};

// Add more methods here
