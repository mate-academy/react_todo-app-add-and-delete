import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { USER_ID, deleteTodos, getTodos } from '../api/todos';
import { UserWarning } from '../UserWarning';
import { Status, filterTodo } from '../utils/TodosFilter';

type TodosContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setQuery: Dispatch<SetStateAction<string>>;
  query: string;
  newTodo: Todo[];
  setFiltred: Dispatch<SetStateAction<Status>>;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  loading: boolean;
  handleCompleted: (id: number) => void;
  filtred: Status;
  handleErrorMessage: () => void;
  todoDeleteButton: (userId: number, todoId: number) => void;
  handleCompleteAll: () => void;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  titleField: RefObject<HTMLInputElement> | null;
};

const initialTodosContextValue: TodosContextType = {
  todos: [],
  setTodos: () => {},
  setQuery: () => [],
  query: '',
  newTodo: [],
  setFiltred: () => {},
  errorMessage: '',
  setErrorMessage: () => '',
  loading: false,
  handleCompleted: () => {},
  filtred: Status.All,
  handleErrorMessage: () => {},
  todoDeleteButton: () => {},
  handleCompleteAll: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  setLoading: () => {},
  titleField: null,
};

export const TodosContext = React.createContext<TodosContextType>(
  initialTodosContextValue,
);

type PropsContext = {
  children: React.ReactNode;
};

export const TodoContextProvider: React.FC<PropsContext> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filtred, setFiltred] = useState<Status>(Status.All);
  const [loading, setLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const titleField = useRef<HTMLInputElement>(null);

  const newTodo: Todo[] = filterTodo(todos, filtred);

  function getAllTodos() {
    setLoading(true);
    getTodos()
      .then(receivedTodos => {
        setTodos(receivedTodos);
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setLoading(false);
        titleField.current?.focus();
      });
  }

  const todoDeleteButton = (userId: number, todoId: number) => {
    const deletedTodo = todos.find(todo => todo.id === todoId);

    deleteTodos(userId, todoId)
      .then(() => {
        if (deletedTodo) {
          setTempTodo(deletedTodo);
        }

        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {})
      .finally(() => {
        setTimeout(() => {
          titleField.current?.focus();
          setTempTodo(null);
        }, 500);
      });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  useEffect(() => {
    if (USER_ID) {
      getAllTodos();
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleCompleted = (id: number) => {
    const newStateTodos = newTodo.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }

      return todo;
    });

    setTodos(newStateTodos);
  };

  const handleCompleteAll = () => {
    const hasIncomplete = todos.some(todo => !todo.completed);

    const newStateTodos = todos.map(todo => ({
      ...todo,
      completed: !!hasIncomplete,
    }));

    setTodos(newStateTodos);
  };

  const handleErrorMessage = () => {
    setErrorMessage('');
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        query,
        setQuery,
        newTodo,
        setFiltred,
        errorMessage,
        setErrorMessage,
        loading,
        handleCompleted,
        filtred,
        handleErrorMessage,
        todoDeleteButton,
        handleCompleteAll,
        tempTodo,
        setTempTodo,
        setLoading,
        titleField,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
