import { Filter } from './Filter';
import { Todo } from './Todo';

export type Action =
  | { type: 'setTodos'; payload: Todo[] }
  | { type: 'addTodo'; payload: Todo }
  | { type: 'updateTodo'; payload: Todo }
  | { type: 'deleteTodo'; payload: number }
  | { type: 'setFilter'; payload: Filter }
  | { type: 'setError'; payload: string }
  | { type: 'setTempTodo'; payload: Todo | null };
