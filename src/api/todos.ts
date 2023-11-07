import { Todo } from '../types/Todo';
import { NoIdTodo } from '../types/NoIdTodo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, data: NoIdTodo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const updateTodo = (data: Todo) => {
  return client.patch<Todo>(`/todos/${data.id}`, data);
};

export const deleteTodo = (data: Todo) => {
  return client.delete(`/todos/${data.id}`);
};




// https://mate.academy/students-api/todos?userId=11824
