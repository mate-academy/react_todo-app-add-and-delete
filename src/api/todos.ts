import { NewTodoRequest } from '../types/NewTodoRequest';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4075;
const URL: string = `/todos?userId=${USER_ID}`;

export const getTodos = () => {
  return client.get<Todo[]>(URL);
};

// Add more methods here

export const saveTodo = (todo: NewTodoRequest): Promise<Todo> => {
  return client.post<Todo>(URL, todo);
};

export const deleteTodo = (id: number): Promise<Todo> => {
  return client.delete<Todo>(`/todos/${id}`);
};
