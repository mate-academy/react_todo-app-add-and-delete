import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = async (
  title: string, userId: number, completed: boolean,
) => {
  const newTodo = await client.post<Todo>('/todos', {
    title,
    userId,
    completed,
  });

  return newTodo;
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
