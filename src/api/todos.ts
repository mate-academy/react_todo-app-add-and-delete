import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3885;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ id, ...todoData }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, todoData);
};
