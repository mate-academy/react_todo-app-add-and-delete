import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodosFromServer = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodoToServer = (newPost: Omit<Todo, 'id'>) => {
  const { title, userId, completed } = newPost;

  return client.post<Todo>('/todos', { title, userId, completed });
};

export const deleteTodoFromServer = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
