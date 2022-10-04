import { Todo } from '../../types/Todo';

export type Props = {
  todo: Todo;
  onDelete: (todoId: number) => void;
  selectedTodos: number[];
  setSelectedTodos: (todoId: number[]) => void;
  onUpdate: (todoId: number, data: Omit<Todo, string>) => void;
  selectedTodo: number;
  setSelectedTodo: (value: number) => void;
  todos: Todo[];
};
