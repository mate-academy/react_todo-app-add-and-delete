import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4077;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Todo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// Add more methods here
// https://mate.academy/students-api/todos?userId=4077
