import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';

export const emptyTodo: Todo = {
  id: 0,
  completed: false,
  userId: USER_ID,
  title: '',
};
