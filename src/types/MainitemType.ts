import type { Todo } from './Todo';

export type MainitemType = {
  shownTodos: Todo;
  onUpdate: (value: Todo) => void;
  editFieldVal: number | null;
  onEditFieldVal: (value: number | null) => void;
  editInputVal: string;
  onEditInputVal: (value: string) => void;
  onEditHandle: (value: Todo) => void;
  onDelete: (value: number) => void;
  loadId: number | null;
  onLoadId: (value: number | null) => void;
  inputMainFocus: React.RefObject<HTMLInputElement>;
};
