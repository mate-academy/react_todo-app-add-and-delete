import {
  ReactNode, createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { getTodos } from '../api/todos';
import { Filter } from '../types/Filter';
import { USER_ID } from '../utils/userID';
import { ErrorType } from '../types/Error';

type TodosProps = {
  todos: Todo[];
  setTodos: (todo: Todo[]) => void;
  visibleTodos: Todo[];
  taskName: string;
  setTaskName: (query: string) => void;
  filterBy: Filter;
  setFilterBy: (query: Filter) => void,
  countIncompleteTask: number;
  error: null | string;
  setError: (err: string | null) => void;
  visibleTasks: Todo[];
  isAddingTask: boolean;
  setIsAddingTask: (TF: boolean) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
  deletingTask: number[];
  setDeletingTask: (n: number[]) => void;
};

const TodosContext = createContext<TodosProps>({
  todos: [],
  setTodos: () => undefined,
  visibleTodos: [],
  taskName: '',
  setTaskName: () => undefined,
  filterBy: 'all',
  setFilterBy: () => undefined,
  countIncompleteTask: 0,
  error: null,
  setError: () => undefined,
  visibleTasks: [],
  isAddingTask: false,
  setIsAddingTask: () => undefined,
  tempTodo: null,
  setTempTodo: () => undefined,
  deletingTask: [],
  setDeletingTask: () => undefined,
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
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [taskName, setTaskName] = useState<string>('');
  const [filterBy, setFilterBy] = useState<Filter>('all');
  const [error, setError] = useState<null | string>(null);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [deletingTask, setDeletingTask] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const visibleTasks = useMemo(() => {
    return dataFilter(todos, filterBy);
  }, [todos, filterBy]);

  const countIncompleteTask = useMemo(() => {
    return dataFilter(todos, 'active').length;
  }, [todos]);

  const value = {
    todos,
    setTodos,
    taskName,
    setTaskName,
    filterBy,
    setFilterBy,
    countIncompleteTask,
    error,
    setError,
    visibleTodos,
    visibleTasks,
    isAddingTask,
    setIsAddingTask,
    tempTodo,
    setTempTodo,
    deletingTask,
    setDeletingTask,
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => {
        setTodos(data);
        setVisibleTodos(data);
      })
      .catch(() => setError(ErrorType.load));
  }, []);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => useContext(TodosContext);
