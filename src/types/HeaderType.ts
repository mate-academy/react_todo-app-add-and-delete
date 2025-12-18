import type { Todo } from './Todo';
export type HeaderType = {
  onVal: string;
  todosItemsList: Todo[];
  onAllItems: boolean;
  load: boolean;
  inputFocus: React.RefObject<HTMLInputElement>;
  onChangeVal: (value: string) => void;
  onTodoList: (value: Todo[]) => void;
  onAdd: ({ completed, title, userId }: Omit<Todo, 'id'>) => void;
  onTempTodo: (value: Todo | null) => void;
  onError: (value: string | null) => void;
};
