import React, {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';
import { Todo, ErrorMessage, Status } from '../../types';

interface TodosContextType {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  newTodo: Todo | null;
  setNewTodo: Dispatch<SetStateAction<Todo | null>>;
  error: ErrorMessage | null;
  setError: Dispatch<SetStateAction<ErrorMessage | null>>;
  filterStatus: Status;
  setFilterStatus: Dispatch<SetStateAction<Status>>;
  todoLoading: boolean;
  setTodoLoading: Dispatch<SetStateAction<boolean>>;
  isTodoDeleting: number[];
  setIsTodoDeleting: Dispatch<SetStateAction<number[]>>;
  USER_ID: number;
}

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  newTodo: null,
  setNewTodo: () => {},
  error: null,
  setError: () => {},
  filterStatus: Status.All,
  setFilterStatus: () => {},
  todoLoading: false,
  setTodoLoading: () => {},
  isTodoDeleting: [],
  setIsTodoDeleting: () => {},
  USER_ID: 10238,
});

export const TodosContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);

  const [error, setError] = useState<ErrorMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState(Status.All);
  const [todoLoading, setTodoLoading] = useState(false);
  const [isTodoDeleting, setIsTodoDeleting] = useState<number[] | []>([]);

  const USER_ID = 10238;

  const contextValue = {
    todos,
    setTodos,
    newTodo,
    setNewTodo,
    error,
    setError,
    filterStatus,
    setFilterStatus,
    todoLoading,
    setTodoLoading,
    isTodoDeleting,
    setIsTodoDeleting,
    USER_ID,
  };

  return (
    <TodosContext.Provider value={contextValue}>
      {children}
    </TodosContext.Provider>
  );
};
