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
  todoItem: Todo | null;
  setTodoItem: (todo: Todo) => void;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const AppProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filter>('all');
  const [errorTitle, setErrorTitle] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [todoItem, setTodoItem] = useState<Todo | null>(null);

  const setTodosContext = useCallback((todosArray: Todo[], filter: Filter) => {
    setTodos(filterTodos(todosArray, filter));
  }, []);

  const filteredTodos = filterTodos(todos, filterBy);

  const setError = useCallback((error: string) => {
    setErrorTitle(error);
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

    setIsDisabled(true);
    setTodoItem(todo);
    addTodos(todo).then(() => {
      setTodos((prev) => [...prev, {...todo, id: Number(new Date())}]);
    })
      .catch(() => setError(getError('addError')))
      .finally(() => {
        setIsDisabled(false);
        setTodoItem(null);
      });
  }, []);

  const removeTodoContext = useCallback((todoId: number) => {
    if (!todoId) {
      setError(getError('deleteError'));

      return;
    }

    removeTodos(todoId)
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== todoId)))
      .catch(() => setError(getError('deleteError')));
  }, []);

  // const editedTodoContext = useCallback((todo: Todo) => {
  //   setTodos((prev) => prev.map((v) => (v.id === todo.id ? todo : v)));
  // }, [])

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
      todoItem,
      setTodoItem,
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
