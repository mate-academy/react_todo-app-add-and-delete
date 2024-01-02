import {
  createContext, FC, ReactNode, useContext, useEffect, useMemo, useState,
} from 'react';
import { ErrorType, FilterType, Todo } from '../types';
import { addTodo, deleteTodo, getTodos } from '../api/todos';
import { useAuthContext } from './AuthContext';

type Props = {
  children: ReactNode;
};

type TodoProviderType = {
  loading: number | null;
  setLoading: (id: (number | null)) => void;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  errors: ErrorType | null;
  setErrors: (error: ErrorType | null) => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  title: string;
  setTitle: (title: string) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo) => void;
  filteredTodos: Todo[];
  inProgress: number;
  deleteTodoFromServer: (todoId: number) => void;
  deleteCompletedTodos: () => void;
  addTodoToServer: (todo: Omit<Todo, 'id'>) => void;
};

const TodoContext = createContext<TodoProviderType>({
  loading: null,
  setLoading: () => {},
  todos: [],
  setTodos: () => {},
  errors: null,
  setErrors: () => {},
  filter: FilterType.All,
  setFilter: () => {},
  filteredTodos: [],
  title: '',
  setTitle: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  inProgress: 0,
  deleteTodoFromServer: () => {},
  deleteCompletedTodos: () => {},
  addTodoToServer: () => {},
});

export const TodosProvider: FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState<number | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errors, setErrors] = useState<ErrorType | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const userId = useAuthContext();

  const deleteTodoFromServer = async (todoId: number) => {
    setErrors(null);
    setLoading(todoId);
    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(
        todo => todo.id !== todoId,
      ));
    } catch (error) {
      setErrors(ErrorType.delete);
    } finally {
      setLoading(null);
    }
  };

  const deleteCompletedTodos = async () => {
    setErrors(null);
    try {
      const completedTodos = todos.filter(todo => todo.completed);
      const queueOfTodosForDelete = completedTodos
        .map(todo => {
          setLoading(todo.id);

          return deleteTodoFromServer(todo.id);
        });

      await Promise.allSettled(queueOfTodosForDelete);
    } catch (error) {
      setErrors(ErrorType.delete);
    } finally {
      setLoading(null);
    }
  };

  const addTodoToServer = async (newTodo: Omit<Todo, 'id'>) => {
    setErrors(null);
    try {
      setLoading(0);
      setTempTodo({ id: 0, ...newTodo });
      const data = await addTodo(newTodo);

      setTitle('');
      setTodos(currentTodos => [...currentTodos, data]);
    } catch (error) {
      setErrors(ErrorType.add);
    } finally {
      setTempTodo(null);
      setLoading(null);
    }
  };

  useEffect(() => {
    if (userId) {
      setErrors(null);
      const fetchData = async () => {
        try {
          const data = await getTodos(userId);

          setTodos(data);
        } catch (er) {
          setErrors(ErrorType.load);
        }
      };

      fetchData();
    }
  }, [userId]);

  const filteredTodos = useMemo(() => {
    return todos
      .filter(todo => {
        switch (filter) {
          case FilterType.Active:
            return !todo.completed;
          case FilterType.Completed:
            return todo.completed;
          default:
            return true;
        }
      });
  }, [filter, todos]);

  const inProgress = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const value = () => ({
    loading,
    setLoading,
    todos,
    setTodos,
    errors,
    setErrors,
    filter,
    setFilter,
    filteredTodos,
    title,
    setTitle,
    tempTodo,
    setTempTodo,
    inProgress,
    deleteTodoFromServer,
    deleteCompletedTodos,
    addTodoToServer,
  });

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
