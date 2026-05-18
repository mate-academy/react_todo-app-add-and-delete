import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4184;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodoCompleted = (
  id: number | number[],
  { completed: oldStatus }: Partial<Todo>,
) => {
  return client.patch<Todo>(`/todos/${id}`, { completed: !oldStatus });
};

// Add more methods here
