/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { client } from '../../utils/fetchClient';
import { Todo } from '../../types/Todo';
import { CompletedAll } from '../../types/CompletedAll';
import { FilterParams } from '../../types/FilterParams';

const USERS_URL = '?userId=';

export const USER_ID = 50;

type TodosContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<Todo[]>;
  loading: boolean;
  isCompletedAll: CompletedAll;
  setIsCompletedAll: React.Dispatch<CompletedAll>;
  filter: FilterParams;
  setFilter: React.Dispatch<FilterParams>;
  tempItem: Todo | null;
  setTempItem: React.Dispatch<Todo | null>;
  addTodo: (newTodo: Todo) => void;
  deleteTodo: (id: number) => void;
  errorMessage: string;
  setErrorMessage: React.Dispatch<string>;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => { },
  loading: false,
  isCompletedAll: null,
  setIsCompletedAll: () => { },
  filter: FilterParams.All,
  setFilter: () => { },
  tempItem: null,
  setTempItem: () => { },
  addTodo: () => { },
  deleteTodo: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  setCount: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCompletedAll, setIsCompletedAll] = useState<CompletedAll>(null);
  const [filter, setFilter] = useState<FilterParams>(FilterParams.All);
  const [tempItem, setTempItem] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [count, setCount] = useState(0);

  function loadTodos() {
    setLoading(true);

    client.get<Todo[]>(USERS_URL + USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setLoading(false));
  }

  useEffect(loadTodos, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (errorMessage) {
      timerId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [count]);

  function addTodo({ userId, title, completed }: Todo) {
    setErrorMessage('');
    setLoading(true);

    return client.post<Todo>(USERS_URL + USER_ID, { userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTempItem(null);
        setLoading(false);
      });
  }

  function deleteTodo(todoId: number) {
    setErrorMessage('');
    setLoading(true);

    return client.delete(`/${todoId}`)
      .then(() => {
        const updatedTodos = todos.filter(upTodo => upTodo.id !== todoId);

        setTodos(updatedTodos);
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setLoading(false));
  }

  const value = useMemo(() => ({
    todos,
    setTodos,
    loading,
    isCompletedAll,
    setIsCompletedAll,
    filter,
    setFilter,
    tempItem,
    setTempItem,
    addTodo,
    deleteTodo,
    errorMessage,
    setErrorMessage,
    setCount,
  }), [
    todos,
    loading,
    isCompletedAll,
    filter,
    tempItem,
    errorMessage,
  ]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
