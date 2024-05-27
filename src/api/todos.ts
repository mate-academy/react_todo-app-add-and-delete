import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

// https://mate.academy/students-api/todos?userId=664
export const USER_ID = 664;

const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
const deleteTodo = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};

const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', newTodo);
};

export const todoService = {
  getTodos,
  deleteTodo,
  addTodo,
};
