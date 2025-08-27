import { client } from './fetchClient'; // same import used by getTodos/deleteTodo

export type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export const USER_ID = 3430; // or whatever constant you have

export const getTodos = (userId: number) =>
  client.get<Todo[]>(`/todos?userId=${userId}`);

export const createTodo = (
  userId: number,
  data: { title: string; completed: boolean },
) => client.post<Todo>('/todos', { userId, ...data });

export const deleteTodo = (id: number) => client.delete(`/todos/${id}`);
