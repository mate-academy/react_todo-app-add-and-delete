import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoData } from '../types/TodoData';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: TodoData) => {
  return client.post('/todos', data);
};

// Add more methods here
