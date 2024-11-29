import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1920;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const postTodo = (title: string, completed = false) => {
  const data = {
    title: title,
    userId: USER_ID,
    completed: completed,
  };

  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
