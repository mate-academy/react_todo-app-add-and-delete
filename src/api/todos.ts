import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, data: {}) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data)
    .then(res => {
      return {
        id: res.id,
        userId: res.userId,
        title: res.title,
        completed: res.completed,
      };
    });
};

export const removeTodo = (userId: number, id: number) => {
  return client.delete(`/todos/${id}?userId=${userId}`);
};
