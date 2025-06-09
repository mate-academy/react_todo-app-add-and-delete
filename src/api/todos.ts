import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID_G = 1;

export const getTodos = (USER_ID: number) => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const handleAddTodoApi = (title: string) => {
  return client.post<Todo>(`/todos`, {
    title,
    userId: USER_ID_G,
    completed: false,
  });
};
// Add more methods here

export const deleteTodo = (id: number) => {
  return client.delete(`todos/${id}`);
};
