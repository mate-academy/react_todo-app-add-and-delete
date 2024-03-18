import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { getTodos } from '../api/todos';
import { Errors } from '../types/Errors';

type TodosContextType = {
  // todo: Todo;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filterValue: Status;
  setFilterValue: React.Dispatch<React.SetStateAction<Status>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  multiLoader: boolean;
  setMultiLoader: React.Dispatch<React.SetStateAction<boolean>>;
  titleField: MutableRefObject<HTMLInputElement | null>;
};

export const TodoContext = React.createContext<TodosContextType>({
  // todo: {},
  todos: [],
  setTodos: () => {},
  filterValue: Status.All,
  setFilterValue: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  multiLoader: false,
  setMultiLoader: () => {},
  titleField: {} as MutableRefObject<HTMLInputElement | null>,
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterValue, setFilterValue] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [multiLoader, setMultiLoader] = useState(false);
  const titleField = useRef<HTMLInputElement | null>(null);

  // const handleLoadingChange = (loadingStatus: boolean) => {
  //   setIsLoading(loadingStatus);
  // };

  const value = {
    // todo,
    todos,
    setTodos,
    filterValue,
    setFilterValue,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    multiLoader,
    setMultiLoader,
    titleField,
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.LoadError);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  return (
    <TodoContext.Provider value={value}> {children} </TodoContext.Provider>
  );
};
