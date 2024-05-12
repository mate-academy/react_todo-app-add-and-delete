import { TypeTodo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 584;

export const getData = async () => {
  try {
    const response  = await client.get<TypeTodo []>(`/todos?userId=${USER_ID}`);

    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async (todoId: number) => {
  try {
    const response  = await client.delete(`/todos/${todoId}`);

    return response;
  } catch (error) {
    throw error;
  }
};

export const createData = async (newTodo: TypeTodo) => {
  return client.post<TypeTodo>('/todos', newTodo);
};

