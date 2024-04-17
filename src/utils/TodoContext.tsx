import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TodoContextType } from '../types/TodoContextType';
import * as todosServices from '../api/todos';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { Errors } from '../types/ErrorsTodo';

const initialTodo: TodoContextType = {
  todos: [],
  status: Status.All,
  errorMessage: Errors.NoErrors,
  draftTodo: null,
  isLoading: false,
  modifiedTodoId: 0,
  setTodos: () => {},
  setStatus: () => {},
  setErrorMessage: () => {},
  setIsLoading: () => {},
  setDraftTodo: () => {},
  deleteTodo: async () => {},
  addTodo: async () => {},
  handleCompleted: () => {},
};

interface Props {
  children: React.ReactNode;
}

const TodoContext = React.createContext<TodoContextType>(initialTodo);

export const TodoContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(Errors.NoErrors);
  const [status, setStatus] = useState(Status.All);
  const [isLoading, setIsLoading] = useState(false);
  const [modifiedTodoId, setModifiedTodoId] = useState(0);
  const [draftTodo, setDraftTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todosServices
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.LoadTodos);
        setTimeout(() => setErrorMessage(Errors.NoErrors), 3000);
      });
  }, []);

  const deleteTodo = useCallback(async (todoId: number) => {
    setIsLoading(true);
    setModifiedTodoId(todoId);
    setErrorMessage(Errors.NoErrors);
    try {
      await todosServices.deleteTodos(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(Errors.DeleteTodo);
      setTimeout(() => setErrorMessage(Errors.NoErrors), 3000);
    } finally {
      setIsLoading(false);
      setModifiedTodoId(0);
    }
  }, []);

  const addTodo = useCallback(async ({ title, completed, userId }: Todo) => {
    setIsLoading(true);
    setErrorMessage(Errors.NoErrors);
    setDraftTodo({ id: 0, title, userId, completed: false });
    try {
      const newestTodo = await todosServices.createTodos({
        title,
        completed,
        userId,
      });

      setDraftTodo(null);
      setTodos(currentTodos => [...currentTodos, newestTodo]);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(Errors.AddTodo);
      setDraftTodo(null);
      setTimeout(() => {
        setErrorMessage(Errors.NoErrors);
      }, 3000);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCompleted = useCallback((currentTodo: Todo) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === currentTodo.id
          ? { ...todo, completed: !todo.completed }
          : todo,
      ),
    );
  }, []);

  const todoValue = useMemo(
    () => ({
      todos,
      status,
      errorMessage,
      draftTodo,
      modifiedTodoId,
      isLoading,
      setTodos,
      setStatus,
      setErrorMessage,
      setDraftTodo,
      setIsLoading,
      addTodo,
      deleteTodo,
      handleCompleted,
    }),
    [
      todos,
      status,
      errorMessage,
      isLoading,
      modifiedTodoId,
      draftTodo,
      addTodo,
      deleteTodo,
      handleCompleted,
    ],
  );

  return (
    <TodoContext.Provider value={todoValue}>{children}</TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
