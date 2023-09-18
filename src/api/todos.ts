import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${newTodo.userId}`, newTodo);
};

export const deleteTodo = (taskId: number) => {
  return client.delete(`/todos/${taskId}`);
};
// Add more methods here
