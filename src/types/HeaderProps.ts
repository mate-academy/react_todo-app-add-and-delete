import { Todo } from './TodoProps';

export type HeaderProps = {
  todos: Todo[];
  query: string;
  setQuery: (value: string) => void;
  onFormSubmit: (event: React.FormEvent) => void;
  onToggleAll: () => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onFocusInput: () => void;
};
