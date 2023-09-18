import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export interface TodoContextType {
  todos: Todo[],
  error: Errors | null;
  filterTodos: FilterType,
  handleShowError: (err: Errors) => void,
  handleSetFilterTodos: (filterType: FilterType) => void,
  closeErrorMessage: () => void
}

export enum Errors {
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
}

export type Props = React.PropsWithChildren<{}>;
