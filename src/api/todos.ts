import { TodoType } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<TodoType[]>(`/todos?userId=${userId}`);
};

type PostTodoResponse = TodoType;

export const postTodo = (data: Omit<TodoType, 'id'>) => {
  return client.post<PostTodoResponse>('/todos/', data);
};

export const deleteTodo = (data: TodoType) => {
  return client.delete(`/todos/${data.id}/`);
};

export const patchTodo = (data: Partial<TodoType> & { id: number }) => {
  return client.patch(`/todos/${data.id}/`, {
    ...data,
  });
};
