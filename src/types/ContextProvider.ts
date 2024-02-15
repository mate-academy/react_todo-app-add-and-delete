import { Status } from './Status';
import { Todo } from './Todo';

export type ContextProvider = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  status: Status,
  setStatus: React.Dispatch<React.SetStateAction<Status>>,
  isFocused: boolean,
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>,
  isError: boolean,
  setIsError: React.Dispatch<React.SetStateAction<boolean>>,
  errorText: string,
  setErrorText: React.Dispatch<React.SetStateAction<string>>,
  tempToDo: Todo | null,
  setTempToDo: (React.Dispatch<React.SetStateAction<Todo | null>>),
};
