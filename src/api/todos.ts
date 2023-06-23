import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const fetchTodos = async (userId: string): Promise<Todo[]> => {
  try {
    const arrTodos = await client.get<Todo[]>(`/todos?userId=${userId}`);

    return arrTodos;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const fetchAddTodo = (userId: number, todo: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const fetchUpdateTodos = (todoId: number, title: string) => {
  return client.patch<Todo>(`/todos/${todoId}`, { title });
};

export const remove = (id: number) => {
  return client.delete(`/todos/${id}`);
};
