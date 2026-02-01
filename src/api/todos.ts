import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3893;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

// export const updateTodo = (todoId, data) => {
//   return client.patch<Todo>(`/todos?userId=${USER_ID}`);
// };

//
// My User Id = 3893 DON'T DELETE
//https://mate.academy/students-api/todos?userId=3893
