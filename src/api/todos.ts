import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export interface TodoData {
  title: string,
  userId: number,
  completed: boolean,
}

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodo = (newTodo: TodoData) => {
  return client.post('/todos', newTodo);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
