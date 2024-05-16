import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 478;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, completed, userId });
};

export const toggleCompleted = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed: !completed });
};

export const editTodo = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title: title });
};
