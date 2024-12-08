import { TodoInterface } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2039;

export const get = async () => {
  try {
    const todos = await client.get<TodoInterface[]>(`/todos?userId=${USER_ID}`);

    return todos;
  } catch (error) {
    throw new Error('Unable to load todos');
  }
};

export const delTodo = async (id: number) => {
  try {
    const deleteTodo = await client.delete(`/todos/${id}`);

    return deleteTodo;
  } catch (error) {
    throw new Error('Unable to delete a todo');
  }
};

export const addTodo = async (title: string) => {
  try {
    const adTodo = await client.post(`/todos/`, {
      completed: false,
      title,
      userId: 2039,
    });

    return adTodo;
  } catch (error) {
    throw new Error('Unable to add a todo');
  }
};
