import React, {
  createContext, ReactNode, useMemo, useState,
} from 'react';
import { deleteTodo } from './api/todos';
import { ErrorMessage } from './types/errorMessage';
import { Todo } from './types/Todo';

type Props = {
  children: ReactNode,
};

const deafultValue = {
  userID: 11443,
  todos: [],
  setTodos: () => { },
  errorMessage: ErrorMessage.NO,
  setErrorMessage: () => { },
  errorNotificationHandler: () => { },
  isLoading: false,
  setIsLoading: () => { },
  deletingTodoHandler: () => { },
  todosIdsUpdating: [],
  setTodosIdsUpdating: () => { },
  tempTodo: null,
  setTempTodo: () => { },
};

interface ITodosContext {
  userID: number,
  todos: Todo[],
  setTodos: (t: Todo[]) => void,
  errorMessage: ErrorMessage,
  setErrorMessage: (e: ErrorMessage) => void,
  errorNotificationHandler: (e: ErrorMessage) => void,
  isLoading: boolean,
  setIsLoading: (b: boolean) => void,
  deletingTodoHandler: (...id: number[]) => void,
  todosIdsUpdating: number[];
  setTodosIdsUpdating: (ids: number[]) => void;
  tempTodo: Todo | null,
  setTempTodo: (t: Todo | null) => void,
}

export const TodosContext = createContext<ITodosContext>(deafultValue);

export const ContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NO);
  const [isLoading, setIsLoading] = useState(false);
  const [todosIdsUpdating, setTodosIdsUpdating] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const errorNotificationHandler = (messageType: ErrorMessage) => {
    setErrorMessage(messageType);
    setTimeout(() => setErrorMessage(ErrorMessage.NO), 3000);
  };

  const deletingTodoHandler = async (...ids: number[]) => {
    setTodosIdsUpdating(ids);

    setIsLoading(true);
    const promises = ids.map(async (id) => {
      try {
        await deleteTodo(id);

        return id;
      } catch {
        return null;
      }
    });

    const deletedIds = await Promise.all(promises);

    setTodos(todos.filter(todo => !deletedIds.includes(todo.id)));

    if (deletedIds.includes(null)) {
      errorNotificationHandler(ErrorMessage.DELETE);
    }

    setTodosIdsUpdating([]);
  };

  const userID = 11443;

  const value = useMemo(() => ({
    userID,
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    errorNotificationHandler,
    isLoading,
    setIsLoading,
    deletingTodoHandler,
    todosIdsUpdating,
    setTodosIdsUpdating,
    tempTodo,
    setTempTodo,
  }), [todos, errorMessage, todosIdsUpdating, tempTodo]);

  return (
    <>
      <TodosContext.Provider value={value}>
        {children}
      </TodosContext.Provider>
    </>
  );
};
