import { Todo } from './Todo';

export default interface TodoContext {
  deletingTodos: Todo[];
  addTodoForDelete: (todo: Todo) => void;
  removeTodoForDelete: (todo: Todo) => void;
  resetDeletingTodos: () => void;
}
