import { ErrorMessage } from './ErrorMessages';
import { FilterItem } from './FilterItem';
import { Todo } from './Todo';

export type ContextProps = {
  todos: Todo[] | [],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  filter: FilterItem,
  setFilter: React.Dispatch<React.SetStateAction<FilterItem>>,
  errorMessage: string,
  handleErrorMessage: (value: ErrorMessage) => void,
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  isLoadingAll: boolean,
  setIsLoadingAll: React.Dispatch<React.SetStateAction<boolean>>,
};
