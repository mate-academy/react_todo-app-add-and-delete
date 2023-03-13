import { TodoType } from '../types/TodoType';
import { client } from '../utils/fetchClient';

const url = '/todos?userId=';

export const getTodos = (userId: number) => {
  return client.get<TodoType[]>(`${url}${userId}`);
};

export const addTodo = (userId: number, query: string) => {
  return client.post<TodoType>(`${url}${userId}`, {
    title: query,
    userId,
    completed: false,
    id: 0,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
