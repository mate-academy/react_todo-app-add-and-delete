import * as todoServise from '../api/todos';
import { Todo } from '../types/Todo';

export const prepareNewTodo = (title: string): Todo => ({
  id: 0,
  title: title.trim(),
  completed: false,
  userId: todoServise.USER_ID,
});

export const createTodoOnServer = (title: string) => {
  return todoServise.createTodo(title.trim());
};
