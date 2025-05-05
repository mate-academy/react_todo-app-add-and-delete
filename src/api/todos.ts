import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2181;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = async (data: Todo) => {
  try {
    const response = await client.post<Todo>('/todos', {
      ...data,
      userId: USER_ID,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
// Add more methods here
