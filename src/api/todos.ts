import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1608;

export const getTodos = async () => {
  try {
    return await client.get<Todo[]>(`/todos?userId=${USER_ID}`);
  } catch (error) {
    throw new Error('Unable to fetch todos');
  }
};

export const addTodo = async (title: string) => {
  const newTodo = {
    userId: USER_ID,
    title,
    completed: false,
  };

  try {
    return await client.post<Todo>('/todos', newTodo);
  } catch (error) {
    throw new Error('Unable to add todo');
  }
};

export const deleteTodo = async (todoId: number) => {
  try {
    return await client.delete(`/todos/${todoId}`);
  } catch (error) {
    throw new Error('Unable to delete todo');
  }
};
