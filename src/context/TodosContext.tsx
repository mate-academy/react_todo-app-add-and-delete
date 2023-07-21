import { createContext } from 'react';
import { Todo } from '../types/Todo';

type SetTodos = (todos: Todo[]) => void;
type SetErrorMsg = (errorMsg: string) => void;

type TodosContextType = [Todo[], SetTodos, string, SetErrorMsg];

export const TodosContext = createContext<TodosContextType>([
  [],
  {} as SetTodos,
  '',
  {} as SetErrorMsg,
]);
