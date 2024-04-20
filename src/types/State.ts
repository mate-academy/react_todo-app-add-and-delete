import { Todo } from './Todo';

export interface State {
  todos: Todo[];
  filter: string;
  selectedTodo: Todo | null;
  title: string;
  selectedTitle: string;
  error: string;
}
