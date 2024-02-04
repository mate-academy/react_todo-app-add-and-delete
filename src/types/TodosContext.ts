import { Todo } from './Todo';

export default interface TodoContext {
  upatingTodos: Todo[];
  addTodoForUpdate: (todo: Todo) => void;
  removeTodoForUpdate: (todo: Todo) => void;
  resetDeletingTodos: () => void;
}
