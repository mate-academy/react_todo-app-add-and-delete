import { FormEvent, RefObject } from 'react';
import { Todo } from '../../types/Todo';

export type Props = {
  query: string;
  todos: Todo[];
  setQuery: (value: string) => void;
  isTodoLoaded: boolean;
  newTodoField: RefObject<HTMLInputElement>;
  onAddTodo: (event: FormEvent) => void;
};
