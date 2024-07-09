import { Todo } from './Todo';

export interface MainProps {
  todos: Todo[];
  filterBy: string;
  tempTodo: Todo | null;
  handleTodoDelete: (todoId: number) => void;
  deletingCompleted: boolean;
}
