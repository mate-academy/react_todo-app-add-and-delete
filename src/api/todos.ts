import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 111;

const todosPath = '/todos';

export const getTodos = () => {
  return client.get<Todo[]>(`${todosPath}?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`${todosPath}/${todoId}`);
};

export const addTodo = (todoTitle: Todo['title']) => {
  return client.post(todosPath, {
    title: todoTitle,
    userId: USER_ID,
    completed: false,
  });
};
