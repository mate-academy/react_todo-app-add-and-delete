import { Todo } from '../../types/Todo';

export type Props = {
  todo: Todo,
  onRemoveTodo: (id: number) => void,
  selectedTodos: number[],
  setSelectedTodos: (num: number[]) => void,
  onUpdate: (todoId: number, data: Partial<Todo>) => void,
};
