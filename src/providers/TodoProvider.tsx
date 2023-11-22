import {
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Filter } from '../types/Filter';
import { TodoError } from '../types/TodoError';
import { TodoContextType } from '../types/TodoContext';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const USER_ID = 11810;

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  filteredTodos: [],
  setTodos: () => { },

  filter: Filter.All,
  setFilter: () => { },

  error: TodoError.Null,
  setError: () => { },

  inputRef: { current: null },
});

export const TodoProvider = (
  { children }: { children: React.ReactNode },
) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState(TodoError.Null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    client.get(`/todos?userId=${USER_ID}`)
      .then(data => setTodos(data as Todo[]))
      .catch(() => setError(TodoError.Load))
      .finally(() => setTimeout(() => {
        setError(TodoError.Null);
      }, 3000));
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  return (
    <TodoContext.Provider value={{
      todos,
      filteredTodos,
      setTodos,
      filter,
      setFilter,
      error,
      setError,
      inputRef,
    }}
    >
      {children}
    </TodoContext.Provider>
  );
};
