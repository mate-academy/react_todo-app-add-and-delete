import { Todo } from '../types/Todo';
import { client } from '../_utils/fetchClient';

export interface AddTodoResponse {
  data: Todo;
}

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodoApi = async (title: string): Promise<AddTodoResponse> => {
  return client.post('/todos', title);
};

export const removeTodoApi = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
