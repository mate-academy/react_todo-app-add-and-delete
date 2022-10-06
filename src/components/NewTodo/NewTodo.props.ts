import { Todo } from '../../types/Todo';

export type Props = {
  query: string;
  todos: Todo[];
  setQuery: (value: string) => void;
};
