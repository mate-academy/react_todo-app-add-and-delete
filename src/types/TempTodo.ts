import { Todo } from './Todo';

export type TempTodo = {
  tempTodo: Todo | null;
  setTempTodo: (t: Todo | null) => void;
};
