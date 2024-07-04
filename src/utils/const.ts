import { USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';

export const emptyTodo: Todo = {
  id: 0,
  completed: false,
  userId: USER_ID,
  title: '',
};

export const errorDelay = 3000;
