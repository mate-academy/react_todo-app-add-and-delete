import { Todo, PartialTodo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type SingleResponse = {
  'id': number;
  'userId': number;
  'completed': boolean;
  'title': string;
  'createdAt': string;
  'updatedAt': string;
};

export const getTodos = () => {
  return client.get<Todo[]>('/todos');
};

export const getTodosByUser = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const getPendingTodosByUser = (userId: number) => {
  return client
    .get<Todo[]>(`/todos?userId=${userId}&completed=false`);
};

export const postTodo = (title: string, userId: number) => {
  return client.post<SingleResponse>('/todos', {
    title,
    userId,
    completed: false,
  });
};

export const updateTodo = (id: number, fields: PartialTodo) => {
  return client.patch<SingleResponse>(`/todos/${id}`, fields);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
