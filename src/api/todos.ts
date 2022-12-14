import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const AddTodo = async (todo: Omit<Todo, 'id'>) => {
  const newTodo = await client.post<Todo>('/todos', todo);

  return newTodo;
};

export const DeleteTodo = async (todoId: number) => {
  await client.delete(`/todos/${todoId}`);
};
