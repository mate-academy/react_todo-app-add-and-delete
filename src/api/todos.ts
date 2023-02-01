import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

const addTodo = (fieldsToCreate: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', fieldsToCreate);
};

const deleteTodo = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};

export const todosApi = {
  getTodos,
  addTodo,
  deleteTodo,
};

// Add more methods here
