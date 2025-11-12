import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3691;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

/* eslint-disable */
export const createTodo = (data: any) => {
  const options = {
    "title": data,
    "userId": USER_ID,
    "completed": false
  }

  return client.post<Todo>('/todos', options);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`)
}
