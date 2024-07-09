import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 853;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
  // return new Promise((resolve, reject) => {
  //   const random = Math.random();

  //   if (random > 0.5) {
  //     resolve(id);
  //   } else {
  //     reject(id);
  //   }
};
