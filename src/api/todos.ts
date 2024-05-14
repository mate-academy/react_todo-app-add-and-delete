import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({
  title,
  userId,
  completed,
}: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post('/todos/', { title, userId, completed });
};

export const updateTodo = (todo: Partial<Todo>): Promise<Todo> => {
  return client.patch(`/todos/${todo.id}`, {
    completed: todo.completed,
    title: todo.title,
  });
};
