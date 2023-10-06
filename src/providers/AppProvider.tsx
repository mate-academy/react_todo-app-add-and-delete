import {
  createContext, useCallback, useContext, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { Filter, filterTodos } from '../utils/utils';
import { addTodos, removeTodos } from '../api/todos';
import { getError } from '../utils/error';

type Props = React.PropsWithChildren<{}>;

type TodoContextType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filterBy: Filter;
  filteredTodos: Todo[];
  setTodosContext: (todo: Todo[], filterBy: Filter) => void;
  errorTitle: string;
  setError: (error: string) => void;
  title: string;
  setTitleContext: (title: string) => void;
  setFilterBy: (filter: Filter) => void;
  isLoading: boolean;
  setIsLoadingContext: (bool: boolean) => void;
  addTodoContext: (todo: Todo) => void;
  removeTodoContext: (todoId: number) => void;
  isDisabled: boolean;
  setIsDisabled: (bool: boolean) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo) => void;
  editedTodo: Todo | null;
  setEditedTodo: (todo: Todo) => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const AppProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filter>('all');
  const [errorTitle, setErrorTitle] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);

  const setTodosContext = useCallback((todosArray: Todo[], filter: Filter) => {
    setTodos(filterTodos(todosArray, filter));
  }, []);

  const filteredTodos = filterTodos(todos, filterBy);

  const setError = useCallback((error: string) => {
    setErrorTitle(error);
    setTimeout(() => {
      setError('');
    }, 3000);
  }, []);

  const setTitleContext = useCallback((titleInput: string) => {
    setTitle(titleInput);
  }, []);

  const setIsLoadingContext = useCallback((bool: boolean) => {
    setIsLoading(bool);
  }, []);

  const addTodoContext = useCallback((todo: Todo) => {
    if (!todo) {
      setError(getError('addError'));

      return;
    }

    setEditedTodo(todo);
    setIsLoading(true);
    setIsDisabled(true);
    setTempTodo(todo);
    addTodos(todo).then((todoFromServerWithId) => {
      setTodos((prev) => [...prev, todoFromServerWithId]);
      setTitleContext('');
    })
      .catch(() => setError(getError('addError')))
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
        setIsLoading(false);
        setEditedTodo(null);
      });
  }, []);

  const removeTodoContext = useCallback((todoId: number) => {
    if (!todoId) {
      setError(getError('deleteError'));

      return;
    }

    setIsLoading(true);
    removeTodos(todoId)
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== todoId)))
      .catch(() => setError(getError('deleteError')))
      .finally(() => {
        setIsLoading(false);
        setEditedTodo(null);
      });
  }, []);

  return (
    <TodoContext.Provider value={{
      todos,
      setTodos,
      setTodosContext,
      filterBy,
      filteredTodos,
      errorTitle,
      setError,
      title,
      setTitleContext,
      setFilterBy,
      isLoading,
      setIsLoadingContext,
      addTodoContext,
      removeTodoContext,
      isDisabled,
      setIsDisabled,
      tempTodo,
      setTempTodo,
      editedTodo,
      setEditedTodo,
    }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }

  return context;
};
