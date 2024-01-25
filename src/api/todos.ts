import { Todo } from './types/Todo';
import { client } from './fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const updateTodoStatus = (
  id: number,
  completed: boolean,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, completed);
};

export const createTodo = ({
  title,
  userId,
  completed,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos/', { title, userId, completed });
};

export const deleteTodo = (
  todoId: number,
) => {
  return client.delete(`/todos/${todoId}`);
};
