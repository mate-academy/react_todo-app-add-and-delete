import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3258;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodo = (id: number, isCompleted: boolean, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, {
    completed: isCompleted,
    title: title,
  });
};
// Add more methods here
