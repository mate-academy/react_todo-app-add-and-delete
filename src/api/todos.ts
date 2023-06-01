import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addNewTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const removeTodo = (id: string) => {
  return client.delete(`/todos/${id}`);
};
// Add more methods here
