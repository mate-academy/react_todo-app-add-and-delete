import { Todo } from './Todo';

export interface TodoHeaderProps {
  todos: Todo[];
  filteredTodos: Todo[];
  handleNewTodoSubmit: (
    newTitle: string,
    setNewTodoTitle: (title: string) => void
  ) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
  isInputDisabled: boolean;
  toggleAllTodos: () => void;
}
