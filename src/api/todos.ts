import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (userId: number, data: unknown) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos?userId=${userId}`);
};

// function print(value: any) {
//   // eslint-disable-next-line no-console
//   console.log(value);
// }

// function logError(value: any) {
//   // eslint-disable-next-line no-console
//   console.error(value);
// }

// const data = {
//   title: 'Learn JSx',
//   userId: 4,
//   completed: false,
// };

// createTodo(10548, data)
//   .then(print)
//   .catch(logError);

// Add more methods here
