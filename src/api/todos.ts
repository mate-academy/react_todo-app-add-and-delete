import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodo = (newTodo: NewTodo) => {
  return client.post('/todos', newTodo);
};

export const deleteTodo = (url: string) => {
  return client.delete(url);
};

export const patchTodo = (url: string,
  updatedData: { title: string } | { completed: boolean }) => {
  return client.patch(url, updatedData);
};
