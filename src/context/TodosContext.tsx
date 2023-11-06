import { createContext, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { Tabs } from '../types/Tabs';
import { ErrorType } from '../types/ErrorType';
import { getTodos } from '../api/todos';

const USER_ID = 11826;

type DefaultValueType = {
  todos: Todo[];
  setTodos: (todosToSet: Todo[]) => void;
  selectedFilter: Tabs;
  setSelectedFilter: (tab: Tabs) => void;
  todosToDisplay: Todo[]
  error: ErrorType
  setError: (errro: ErrorType) => void;
  tempTodo: Todo | null,
  setTempTodo: (todo: Todo | null) => void,
  USER_ID: number,
};

export const TodosContext = createContext<DefaultValueType>({
  todos: [],
  setTodos: () => {},
  selectedFilter: Tabs.All,
  setSelectedFilter: () => {},
  todosToDisplay: [],
  error: ErrorType.Success,
  setError: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  USER_ID: 11826,
});

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Tabs>(Tabs.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState(ErrorType.Success);

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => setTodos(data as Todo[]))
      .catch(() => {
        setError(ErrorType.Loading);
      });
  }, []);

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      setError(ErrorType.Success);
    }, 3000);

    return () => {
      clearTimeout(errorTimeout);
    };
  }, [error]);

  const todosToDisplay = todos.filter(todo => {
    switch (selectedFilter) {
      case Tabs.All:
        return todo;
      case Tabs.Active:
        return !todo.completed;
      case Tabs.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        selectedFilter,
        setSelectedFilter,
        todosToDisplay,
        error,
        setError,
        tempTodo,
        setTempTodo,
        USER_ID,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
