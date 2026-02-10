import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3943;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ title }: { title: string }) => {
  return client.post<Todo>(`/todos`, {
    userId: USER_ID,
    title,
    completed: false,
  });
};

// const wait = (ms: number) =>
//   new Promise(resolve => setTimeout(resolve, ms));

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// export const deleteTodo = async (id: number) => {
//   await wait(1500); //задержка

//   return client.delete(`/todos/${id}`);
// };

export const updateTodo = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
