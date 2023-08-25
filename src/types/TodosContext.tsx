import { ErrorMessage } from '../Enum/ErrorMessage';
import { ListAction } from '../Enum/ListAction';
import { Todo } from './Todo';

export type TodosContext = {
  todo: Todo[],
  setTodo: (value: Todo[]) => void,
  filter: ListAction,
  setFilter: (value: ListAction) => void,
  filterTodos: () => Todo[],
  isToggleAll: boolean;
  setIsToggleAll: (ListAction: boolean) => void,
  isError: ErrorMessage,
  setIsError: (value: ErrorMessage) => void,
  loading: boolean,
  setLoading: (value: boolean) => void,
};
