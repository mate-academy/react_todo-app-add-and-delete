import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type Data = {
  userId: number,
  title: string,
  completed: boolean,
};

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodo = (userId: number, data: Data) => {
  return client.post(`/todos?userId=${userId}`, data);
};

export const lastTodoId = async () => {
  const data = await client.get<Todo[]>('/todos');

  const theLastest = Math.max(...data.map(todo => todo.id));

  return theLastest;
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
