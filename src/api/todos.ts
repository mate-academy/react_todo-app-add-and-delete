import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

interface NewTodo {
  userId: number;
  title: string;
  completed: boolean;
}

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: NewTodo) => {
  return client.post('/todos/', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
