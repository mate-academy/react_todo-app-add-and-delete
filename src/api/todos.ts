import { TodoType } from '../types/TodoType';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<TodoType[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = ({ userId, title, completed }: Omit<TodoType, 'id'>) => {
  return client.post<TodoType>('/todos', { userId, title, completed });
};

export const toggleTodoCompleteState = (todoId: number, completed: boolean) => {
  return client.patch<TodoType>(`/todos/${todoId}`, { completed });
};

export const updateTodoTitle = (todoId: number, title: string) => {
  return client.patch<TodoType>(`/todos/${todoId}`, { title });
};

// Add more methods here
