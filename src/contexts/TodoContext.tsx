import {
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { TodoFilter } from '../enums/TodoFilter';
import { TodoError } from '../enums/TodoError';
import { TodoContextType } from '../types/TodoContext';
import { Todo } from '../types/Todo';
import { client } from '../httpClient';

const USER_ID = 11877;

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  filteredTodos: [],
  setTodos: () => { },

  filter: TodoFilter.All,
  setFilter: () => { },

  error: TodoError.Null,
  setError: () => { },

  inputRef: { current: null },
});

export const TodoProvider = (
  { children }: { children: React.ReactNode },
) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoFilter, setTodoFilter] = useState<TodoFilter>(TodoFilter.All);
  const [todoError, setTodoError] = useState(TodoError.Null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    client.get(`/todos?userId=${USER_ID}`)
      .then(data => setTodos(data as Todo[]))
      .catch(() => setTodoError(TodoError.Load))
      .finally(() => setTimeout(() => {
        setTodoError(TodoError.Null);
      }, 3000));
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (todoFilter) {
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
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
      filter: todoFilter,
      setFilter: setTodoFilter,
      error: todoError,
      setError: setTodoError,
      inputRef,
    }}
    >
      {children}
    </TodoContext.Provider>
  );
};
