/* eslint-disable quote-props */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, postData: any) => {
  return client.post<Todo>('/todos', {
    'title': postData.title,
    'userId': userId,
    'completed': postData.completed,
  });
};

export const postDelete = (idPost: number) => {
  return client.delete(`/todos/${idPost}`);
};
