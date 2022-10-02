import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodo = (userId: number, data: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const lastTodoId = async () => {
  const data = await client.get<Todo[]>('/todos');

  const theLastest = Math.max(...data.map(todo => todo.id));

  return theLastest;
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
