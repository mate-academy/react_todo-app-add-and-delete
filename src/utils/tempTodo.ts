import { USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';

export const temporaryTodo: Todo = {
  id: 0,
  userId: USER_ID,
  title: '',
  completed: false,
};
