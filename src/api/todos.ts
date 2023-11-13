import { Todo } from '../types/Todo';
import { client } from '../_utils/fetchClient';
import { USER_ID } from '../_utils/constants';

export interface AddTodoResponse {
  data: Todo;
}

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodoApi = async (
  title: string,
): Promise<AddTodoResponse> => {
  const response = await client.post(
    '/todos', { userId: USER_ID, title, completed: false },
  );

  return { data: response as Todo };
};

export const removeTodoApi = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const setTodoCompletionApi = async (
  todoId: number,
  completed: boolean,
): Promise<Todo> => {
  const response = await client.patch<Todo>(
    `/todos/${todoId}`,
    { completed },
  );

  return response;
};
