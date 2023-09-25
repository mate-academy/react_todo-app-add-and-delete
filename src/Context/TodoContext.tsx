import React, {
  createContext,
  useMemo,
  useState,
} from 'react';
import { CurrentError } from '../types/CurrentError';
import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';
import { getCompletedTodos } from '../utils/getCompletedTodos';
import { getActiveTodos } from '../utils/getActiveTodos';

type Props = {
  children: React.ReactNode
};

interface TodoContextInterface {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: CurrentError,
  setError: (error: CurrentError) => void;
  deleteTodoHandler: (id: number) => void;
  addTodoHandler: (newTodo: Omit<Todo, 'id'>) => Promise<void>
  completedTodos: Todo[];
  activeTodos: Todo[];
  clearCompleted: () => void;
  todosIdToDelete: number[];
  setTodosIdToDelete: (todoIdsToDelete: number[]) => void;
}

const initalContext: TodoContextInterface = {
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  isLoading: false,
  setIsLoading: () => {},
  error: CurrentError.Default,
  setError: () => {},
  deleteTodoHandler: () => {},
  addTodoHandler: async () => {},
  completedTodos: [],
  activeTodos: [],
  clearCompleted: () => {},
  todosIdToDelete: [],
  setTodosIdToDelete: () => {},
};

export const TodoContext = createContext(initalContext);

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState(CurrentError.Default);
  const [isLoading, setIsLoading] = useState(false);
  const [todosIdToDelete, setTodosIdToDelete] = useState<number[]>([]);

  const completedTodos = getCompletedTodos(todos);
  const activeTodos = getActiveTodos(todos);

  const deleteTodoHandler = (todoId: number) => {
    setIsLoading(true);
    setTodosIdToDelete(prevState => [...prevState, todoId]);
    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => setError(CurrentError.DeleteError))
      .finally(() => setIsLoading(false));
  };

  const addTodoHandler = (newTodo: Omit<Todo, 'id'>) => {
    setIsLoading(true);

    return todoService.addTodo(newTodo)
      .then(createdTodo => {
        setTodos((prevTodos) => [...prevTodos, createdTodo]);
      })
      .catch(() => {
        setError(CurrentError.AddError);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const clearCompleted = () => {
    completedTodos.forEach(({ id }) => deleteTodoHandler(id));
  };

  const value = useMemo(() => ({
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    isLoading,
    setIsLoading,
    error,
    setError,
    deleteTodoHandler,
    addTodoHandler,
    completedTodos,
    activeTodos,
    clearCompleted,
    todosIdToDelete,
    setTodosIdToDelete,
  }), [todos, error, isLoading, tempTodo]);

  return (
    <TodoContext.Provider
      value={value}
    >
      {children}
    </TodoContext.Provider>
  );
};
