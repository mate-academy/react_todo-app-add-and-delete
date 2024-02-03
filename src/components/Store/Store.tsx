// /* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect, useMemo, useState,
} from 'react';
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
  added: boolean;
  disabled: boolean;
  setDisabled: React.Dispatch<boolean>;
  pressClearAll: boolean;
  setPressClearAll: React.Dispatch<boolean>;
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
  added: false,
  disabled: false,
  setDisabled: () => {},
  pressClearAll: false,
  setPressClearAll: () => {},
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
  const [added, setAdded] = useState(false);
  const [disabled, setDisabled] = useState(false);
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
  }, [count, errorMessage]);

  function addTodo({ userId, title, completed }: Todo) {
    setErrorMessage('');
    setLoading(true);
    setCount((currentCount) => currentCount + 1);
    setAdded(false);

    return client.post<Todo>(USERS_URL + USER_ID, { userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setAdded(true);
        setIsCompletedAll(null);
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setTempItem(null);
        setLoading(false);
        setDisabled(false);
      });
  }

  function deleteTodo(todoId: number) {
    setErrorMessage('');
    setLoading(true);
    setCount((currentCount) => currentCount + 1);

    return client.delete(`/${todoId}`)
      .then(() => {
        const updatedTodos = todos.filter(upTodo => upTodo.id !== todoId);

        setTodos(() => {
          if (pressClearAll) {
            const notCompletedTodos = todos.filter(todo => !todo.completed);

            setIsCompletedAll(null);

            return notCompletedTodos;
          }

          return updatedTodos;
        });
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setLoading(false);
        setPressClearAll(false);
      });
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
    added,
    disabled,
    setDisabled,
    pressClearAll,
    setPressClearAll,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [
    todos,
    loading,
    isCompletedAll,
    filter,
    tempItem,
    errorMessage,
    added,
    pressClearAll,
    disabled,
  ]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
