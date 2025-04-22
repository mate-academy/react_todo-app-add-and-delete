import { Todo } from '../../types/Todo';

export type TodoItemTypes = {
  deleteTodoHandler: (todo: Todo) => void;
  todo: Todo;
  loadingId: { [key: number]: boolean };
};
