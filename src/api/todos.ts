import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const postTodos = (data: Pick<
Todo, 'userId' | 'title' | 'completed'>) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodos = (todoId:number) => {
  return client.delete(`/todos/${todoId}`);
};
