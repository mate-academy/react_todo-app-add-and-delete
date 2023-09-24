import { TodoType } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<TodoType[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, data: Partial<TodoType>) => {
  return client.post(`/todos?userId=${userId}`, data);
};

export const delTodo = (data: TodoType) => {
  return client.delete(`/todos/${data.id}/`);
};

// Add more methods here
// https://mate.academy/students-api/todos?userId=11524
