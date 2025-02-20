import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const deleteTodoApi = async (id: number): Promise<void> => {
  await client.delete(`/todos/${id}`);
};

export const USER_ID = 1798;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const toggleTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, {
    completed: !todo.completed,
  });
};

export const renameTodo = (todoId: number, title: string) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    title,
  });
};
