import { Todo } from '../../types/Todo';

export type Props = {
  todos: Todo[];
  onUpdate : (todoId: number, data: Partial<Todo>) => void;
  onRemoveTodo: (id: number) => void,
  isTodoLoaded: boolean,
  query: string,
  selectedTodos: number[],
  setSelectedTodos: (num: number[]) => void,
};
