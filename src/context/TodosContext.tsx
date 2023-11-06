import { createContext, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { Tabs } from '../types/Tabs';
import { client } from '../utils/fetchClient';
import { ErrorType } from '../types/ErrorType';

const USER_ID = 11826;

type DefaultValueType = {
  todos: Todo[];
  setTodos: (todosToSet: Todo[]) => void;
  selectedFilter: Tabs;
  setSelectedFilter: (tab: Tabs) => void;
  todosToDisplay: Todo[]
  error: ErrorType
  setError: (errro: ErrorType) => void;
};

export const TodosContext = createContext<DefaultValueType>({
  todos: [],
  setTodos: () => {},
  selectedFilter: Tabs.All,
  setSelectedFilter: () => {},
  todosToDisplay: [],
  error: ErrorType.Success,
  setError: () => {},
});

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Tabs>(Tabs.All);
  const [error, setError] = useState(ErrorType.Success);

  useEffect(() => {
    client.get(`/todos?userId=${USER_ID}`)
      .then(data => setTodos(data as Todo[]))
      .catch(() => setError(ErrorType.Loading))
      .finally(() => setTimeout(() => {
        setError(ErrorType.Success);
      }, 3000));
  }, []);

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
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
