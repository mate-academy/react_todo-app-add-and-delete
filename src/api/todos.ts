import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoData } from '../types/TodoData';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: TodoData) => {
  return client.post('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// Add more methods here
