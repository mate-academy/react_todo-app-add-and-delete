import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  const todos = client.get<Todo[]>(`/todos?userId=${userId}`);

  return todos || [];
};

export const addTodo = async (todo: Omit<Todo, 'id'>) => {
  const newTodo = await client.post('/todos', todo);

  return newTodo;
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
