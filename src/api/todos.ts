import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2154;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id' | 'userId' | 'completed'>) => {
  return client.post<Todo>(`/todos`, {
    ...todo,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
