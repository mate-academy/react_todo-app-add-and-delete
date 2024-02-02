import {
  createContext,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

export type TodoContextType = {
  todos: Todo[],
  tempTodo: Todo | null,
  filteredTodos: Todo[],
  errorMessage: string,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setFilters: React.Dispatch<React.SetStateAction<{ status: TodoStatus }>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
};

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  tempTodo: null,
  filteredTodos: [],
  errorMessage: '',
  setTempTodo: () => {},
  setTodos: () => {},
  setFilters: () => {},
  setErrorMessage: () => {},
});

interface Props {
  children: React.ReactNode,
}

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filters, setFilters]
    = useState<{ status: TodoStatus }>({ status: 'all' });

  const value: TodoContextType = useMemo(() => ({
    todos,
    tempTodo,
    errorMessage,
    setTodos,
    setTempTodo,
    setErrorMessage,
    setFilters,
    filteredTodos: todos.filter(todo => {
      switch (filters.status) {
        case 'uncompleted':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    }),
  }), [todos, tempTodo, errorMessage, filters.status]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
