import { ErrorMessage } from './ErrorMessage';
import { Status } from './Status';
import { Todo } from './Todo';

export type TodosContextType = {
  todos: Todo[];
  setTodos: (value: Todo[] | { (prev: Todo[]) : Todo[] }) => void;
  visibleTodos: Todo[];
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  filter: Status;
  setFilter: (value: Status) => void;
  errorMessage: string;
  setErrorMessage: (value: ErrorMessage) => void;
  isProcessing: number[];
  setIsProcessing: (value: [] | { (prev: number[]) : number[] }) => void;
};
