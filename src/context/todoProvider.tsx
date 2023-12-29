import {
  ReactNode, createContext, useContext, useEffect, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { getTodos } from '../api/todos';
import { Filter } from '../types/Filter';
import { USER_ID } from '../utils/userID';
import { ErrorType } from '../types/Error';

type TodosProps = {
  todos: Todo[];
  setTodos: (tasks: Todo[]) => void;
  taskName: string;
  setTaskName: (query: string) => void;
  filterBy: Filter;
  setFilterBy: (query: Filter) => void,
  count: number;
  error: null | string;
  setError: (err: string | null) => void;
  isAddingTask: boolean;
  setIsAddingTask: (TF: boolean) => void;
};

const TodosContext = createContext<TodosProps>({
  todos: [],
  setTodos: () => undefined,
  taskName: '',
  setTaskName: () => undefined,
  filterBy: 'all',
  setFilterBy: () => undefined,
  count: 0,
  error: null,
  setError: () => undefined,
  isAddingTask: false,
  setIsAddingTask: () => undefined,
});

type Props = {
  children: ReactNode;
};

const dataFilter = (data: Todo[], filtr: Filter) => {
  switch (filtr) {
    case 'active':
      return data.filter(task => !task.completed);
    case 'completed':
      return data.filter(task => task.completed);
    default:
      return data;
  }
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [taskName, setTaskName] = useState<string>('');
  const [filterBy, setFilterBy] = useState<Filter>('all');
  const [count, setCount] = useState<number>(0);
  const [error, setError] = useState<null | string>(null);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  const value = {
    todos,
    setTodos,
    taskName,
    setTaskName,
    filterBy,
    setFilterBy,
    count,
    error,
    setError,
    isAddingTask,
    setIsAddingTask,
  };

  useEffect(() => {
    try {
      getTodos(USER_ID)
        .then(data => setTodos(dataFilter(data, filterBy)));
    } catch (err) {
      setError(ErrorType.Load);
    }

    const counter = todos.filter(task => !task.completed).length;

    setCount(counter);
  }, [todos, filterBy]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => useContext(TodosContext);
