import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

interface NewTodoData {
  title: string;
  userId: number;
  completed: boolean;
}

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodo = (data: NewTodoData) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
