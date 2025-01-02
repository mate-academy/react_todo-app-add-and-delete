import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2215;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (value: string) => {
  const newTodo = {
    title: value,
    completed: false,
  };

  return client.post<Todo>(`/todos`, { ...newTodo, userId: USER_ID });
};

export const renewTodo = (id: number, updatedTodo: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, updatedTodo);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// Add more methods here
