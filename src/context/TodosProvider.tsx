import {
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react';
import { Todo } from '../types/Todo';
import { FilterBy } from '../types/filter';

type Props = {
  children: React.ReactNode;
};

type ContextType = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  errorMessage: string | null;
  setErrorMessage: (errorMessage: string | null) => void;
  filter: FilterBy;
  setFilter: (filter: FilterBy) => void;
  filteredTodos: Todo[];
  setFilteredTodos: (todo: Todo[]) => void;
  counter: number;
  setCounter: (counter: number) => void;
};

export const TodosContext = createContext<ContextType>({
  todos: [],
  setTodos: () => undefined,
  errorMessage: null,
  setErrorMessage: () => undefined,
  filter: FilterBy.All,
  setFilter: () => undefined,
  filteredTodos: [],
  setFilteredTodos: () => undefined,
  counter: 0,
  setCounter: () => undefined,
});

export const useTodos = () => {
  return useContext(TodosContext);
};

export const filterer = (data: Todo[], filter: FilterBy) => {
  switch (filter) {
    case FilterBy.Active:
      return data.filter(({ completed }) => !completed);

    case FilterBy.Completed:
      return data.filter(({ completed }) => completed);

    default:
      return data;
  }
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterBy>(FilterBy.All);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    setFilteredTodos(filterer(todos, filter));
    const incompleteTodos = todos.filter(todo => !todo.completed);

    setCounter(incompleteTodos.length);
  }, [todos, filter]);

  const values = {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    filteredTodos,
    setFilteredTodos,
    counter,
    setCounter,
  };

  return (
    <TodosContext.Provider value={values}>
      {children}
    </TodosContext.Provider>
  );
};
