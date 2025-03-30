import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2520;

export const getTodos = async (): Promise<Todo[]> => {
  try {
    const response = await client.get<Todo[]>(`/todos?userId=${USER_ID}`);

    return response;
  } catch (error) {
    throw new Error('Unable to load todos');
  }
};

export const addTodo = async (title: string): Promise<Todo> => {
  try {
    const response = await client.post<Todo>('/todos', {
      userId: USER_ID,
      title,
      completed: false,
    });

    return response;
  } catch (error) {
    throw new Error('Unable to add todo');
  }
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    await client.delete(`/todos/${id}`);
  } catch (error) {
    throw new Error('Unable to delete todo');
  }
};
