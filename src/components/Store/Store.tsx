import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { client } from '../../utils/fetchClient';
import { Todo } from '../../types/Todo';
import { FilterParams } from '../../types/FilterParams';

const USERS_URL = '?userId=';

export const USER_ID = 50;

type TodosContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<Todo[]>;
  loading: boolean;
  filter: FilterParams;
  setFilter: React.Dispatch<FilterParams>;
  tempItem: Todo | null;
  setTempItem: React.Dispatch<Todo | null>;
  addTodo: (newTodo: Todo) => void;
  deleteTodo: (id: number) => void;
  errorMessage: string;
  setErrorMessage: React.Dispatch<string>;
  pressClearAll: boolean;
  setPressClearAll: React.Dispatch<boolean>;
  setLoading: React.Dispatch<boolean>;
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => { },
  loading: false,
  filter: FilterParams.All,
  setFilter: () => { },
  tempItem: null,
  setTempItem: () => { },
  addTodo: () => { },
  deleteTodo: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  pressClearAll: false,
  setPressClearAll: () => { },
  setLoading: () => { },
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterParams>(FilterParams.All);
  const [tempItem, setTempItem] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [pressClearAll, setPressClearAll] = useState(false);

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
  }, [errorMessage]);

  function addTodo({ userId, title, completed }: Todo) {
    setErrorMessage('');
    setLoading(true);

    return client.post<Todo>(USERS_URL + USER_ID, { userId, title, completed });
  }

  const deleteTodo = useCallback((todoId: number) => {
    setErrorMessage('');
    setLoading(true);

    return client.delete(`/${todoId}`);
  }, []);

  const value = useMemo(() => ({
    todos,
    setTodos,
    loading,
    filter,
    setFilter,
    tempItem,
    setTempItem,
    addTodo,
    deleteTodo,
    errorMessage,
    setErrorMessage,
    pressClearAll,
    setPressClearAll,
    setLoading,
  }), [
    todos,
    loading,
    filter,
    tempItem,
    deleteTodo,
    errorMessage,
    pressClearAll,
  ]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
