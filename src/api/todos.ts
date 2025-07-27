import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

// export const USER_ID = 3044;
export const USER_ID = 3049;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (id: number, data: Todo) => {
  return client.patch(`/todos/${id}`, data);
};
