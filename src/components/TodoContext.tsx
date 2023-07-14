import {
  FC, ReactNode, createContext, useEffect, useMemo, useState, useCallback,
} from 'react';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/ErrorType';
import { getTodos, postTodo, deleteTodo } from '../api/todos';
import { TodoStatus } from '../types/TodoStatus';
import { getFilteredTodos } from '../utils/getFilteredTodos';

type Props = {
  children: ReactNode;
};

interface Context {
  activeTodosLeft: number;
  todosCount: number;
  todos: Todo[];
  tempTodo: Todo | null;
  error: ErrorType | null;
  filterBy: TodoStatus;
  isLoading: boolean;
  selectedTodoIds: number[];
  onTodosChange: (value: Todo[]) => void;
  onErrorChange: (value: ErrorType | null) => void;
  onFilterByChange: (value: TodoStatus) => void;
  onAddNewTodo: (todoTitle: string) => Promise<boolean>;
  onDeleteTodo: (todoId: number) => void;
  onDeleteCompletedTodos: () => void;
}

const USER_ID = 11043;

export const TodoContext = createContext({} as Context);

export const TodoProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(TodoStatus.All);
  const [error, setError] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  const filteredTodos = useMemo(() => (
    getFilteredTodos(todos, filterBy)
  ), [todos, filterBy]);

  const activeTodosLeft = useMemo(() => (
    todos.reduce((count, todo) => {
      if (!todo.completed) {
        return count + 1;
      }

      return count;
    }, 0)
  ), [todos]);

  useEffect(() => {
    setError(null);

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorType.IncorrectUrl));
  }, []);

  const onAddNewTodo = useCallback((todoTitle: string) => {
    const newTodo: Todo = {
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    setError(null);
    setTempTodo(newTodo);
    setIsLoading(true);

    return postTodo(USER_ID, newTodo)
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);

        return true;
      })
      .catch(() => {
        setError(ErrorType.AddTodoError);

        return false;
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  }, []);

  const onDeleteTodo = useCallback((todoId: number) => {
    setIsLoading(true);
    setSelectedTodoIds([todoId]);
    setError(null);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => (
          prevTodos.filter(todo => todo.id !== todoId)
        ));
      })
      .catch(() => setError(ErrorType.DeleteTodoError))
      .finally(() => {
        setIsLoading(false);
        setSelectedTodoIds([]);
      });
  }, []);

  const onDeleteCompletedTodos = useCallback(async () => {
    setError(null);

    try {
      const completedTodosIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setSelectedTodoIds(completedTodosIds);

      const deleteTasks = completedTodosIds.map(todoId => (
        deleteTodo(todoId)
      ));

      await Promise.all(deleteTasks);

      await setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch {
      setError(ErrorType.DeleteTodoError);
    } finally {
      setSelectedTodoIds([]);
    }
  }, [todos]);

  const contextValue: Context = {
    activeTodosLeft,
    todosCount: todos.length,
    todos: filteredTodos,
    tempTodo,
    error,
    filterBy,
    isLoading,
    selectedTodoIds,
    onTodosChange: setTodos,
    onErrorChange: setError,
    onFilterByChange: setFilterBy,
    onAddNewTodo,
    onDeleteTodo,
    onDeleteCompletedTodos,
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};
