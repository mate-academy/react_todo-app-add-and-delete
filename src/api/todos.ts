import { Todo as TodoType } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<TodoType[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const setCompleted = ({ id, completed }: TodoType) => {
  return client.patch<TodoType>(`/todos/${id}`, { completed });
};

export const createTodo = ({ userId, title, completed }
: Omit<TodoType, 'id'>) => {
  return client.post<TodoType>('/todos', { userId, title, completed });
};
