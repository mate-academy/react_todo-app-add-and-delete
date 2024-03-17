import React, {
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../types/todoContext';

export const TodosContext = React.createContext<TodoContext>({
  todos: [],
  setTodos: () => { },
  filter: Status.ALL,
  setFilter: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  todosCounter: (): Todo[] => [],
  text: '',
  setText: () => { },
  leftCount: 0,
  setLeftCount: () => { },
  completedCount: 0,
  setCompletedCount: () => { },
  loading: false,
  setLoading: () => {},
  activeItemId: null,
  setActiveItemId: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>(Status.ALL);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [leftCount, setLeftCount] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);

  const todosCounter = useCallback(() => {
    return todos.filter((todo) => !todo.completed);
  }, [todos]);

  const value = useMemo(() => ({
    todos,
    setTodos,
    filter,
    setFilter,
    errorMessage,
    setErrorMessage,
    todosCounter,
    text,
    setText,
    leftCount,
    setLeftCount,
    completedCount,
    setCompletedCount,
    loading,
    setLoading,
    activeItemId,
    setActiveItemId,
  }), [todos,
    filter,
    errorMessage,
    todosCounter,
    text,
    leftCount,
    completedCount,
    loading,
    activeItemId,
  ]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
