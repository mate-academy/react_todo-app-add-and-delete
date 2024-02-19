import { Dispatch, SetStateAction, createContext } from 'react';
import { Todo } from '../types/Todo';
import { TodoError } from '../types/enums/TodoError';

interface TodosContextType {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;

  listOfAllCompletedTodos: Todo[];
  setListOfAllCompletedTodos: Dispatch<SetStateAction<Todo[]>>

  isErrorVisible: boolean;
  setIsErrorVisible: (a: boolean) => void;

  errorMessage: TodoError,
  setErrorMessage: Dispatch<SetStateAction<TodoError>>
}

const defaultTodosContext: TodosContextType = {
  todos: [],
  setTodos: () => {},

  listOfAllCompletedTodos: [],
  setListOfAllCompletedTodos: () => {},

  isErrorVisible: false,
  setIsErrorVisible: () => {},

  errorMessage: TodoError.Default,
  setErrorMessage: () => {},
};

export const TodosContext
= createContext<TodosContextType>(defaultTodosContext);
