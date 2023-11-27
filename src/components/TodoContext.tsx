import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterBy';
import { ErrorMessage } from '../types/ErrorMessage';
import { TodosContextType } from '../types/TodosContextType';
import { getTodos } from '../api/todos';

export const TodosContext = React.createContext<TodosContextType>({
  USER_ID: 11811,
  todos: [],
  setTodos: () => {},
  filterBy: FilterBy.All,
  setFilterBy: () => {},
  errorMessage: ErrorMessage.Any,
  addErrorMessage: () => { },
  todoLoader: null,
  setTodoLoader: () => { },
  tempTodo: null,
  setTempTodo: () => { },
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [errorMessage, setErrorMessage]
    = useState<ErrorMessage>(ErrorMessage.Any);
  const [todoLoader, setTodoLoader] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const USER_ID = 11811;

  const addErrorMessage = (message: ErrorMessage) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(ErrorMessage.Any), 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => addErrorMessage(ErrorMessage.UnableToLoad))
      .finally(() => setTodoLoader(null));
  }, []);

  const value = useMemo(() => ({
    USER_ID,
    todos,
    setTodos,
    filterBy,
    setFilterBy,
    errorMessage,
    addErrorMessage,
    todoLoader,
    setTodoLoader,
    tempTodo,
    setTempTodo,
  }), [todos, filterBy, errorMessage, todoLoader, tempTodo]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
