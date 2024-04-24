import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 512;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  const todo: Omit<Todo, 'id'> = {
    title,
    userId: USER_ID,
    completed: false,
  };

  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
