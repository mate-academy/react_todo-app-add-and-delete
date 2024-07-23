import { Todo } from '../Types/Todo';
import { client } from '../Utilites/Clients';

export const USER_ID = 880;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>(`/todos`, {
    completed: false,
    userId: USER_ID,
    title,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
