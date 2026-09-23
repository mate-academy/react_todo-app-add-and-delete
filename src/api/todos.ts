import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4466;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todo_id: number) => {
  return client.delete(`/todos/${todo_id}`);
};

export const postTodo = (data: string) => {
  return client.post<Todo>(`/todos`, {
    title: data,
    userId: USER_ID,
    completed: false,
  });
};

// Add more methods here
