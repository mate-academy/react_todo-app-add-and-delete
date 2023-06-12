import { Todo } from './Todo';
import { FilterType } from './FilterType';

export interface ContextType {
  todos: Todo[] | [],
  loading: boolean,
  loadingError: string,
  filterType: FilterType | string,
  setFilterType(p: FilterType): void,
  visibleTodos: Todo[] | [],
  activeTodos: Todo[] | [],
  complet: boolean,
  setComplet(p: boolean): void,
  addTodo(p: string): void,
  processings: number[],
  clearTodos(): void;
  removeTodo(p: number): void,
}
