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
  loading: false,
  modifiedTodoId: 0,
  setTodos: () => {},
  setStatus: () => {},
  setErrorMessage: () => {},
  setLoading: () => {},
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
  const [loading, setLoading] = useState(false);
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

  const deleteTodo = useCallback(
    async (todoId: number) => {
      setLoading(true);
      setModifiedTodoId(todoId);
      setErrorMessage(Errors.NoErrors);
      try {
        await todosServices.deleteTodos(todoId);
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setLoading(false);
      } catch {
        setErrorMessage(Errors.DeleteTodo);
        setTodos(todos);
        setTimeout(() => setErrorMessage(Errors.NoErrors), 3000);
      } finally {
        setLoading(false);
        setModifiedTodoId(0);
      }
    },
    [todos],
  );

  const addTodo = useCallback(async ({ title, completed, userId }: Todo) => {
    setLoading(true);
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
      setLoading(false);
    } catch (error) {
      setErrorMessage(Errors.AddTodo);
      setDraftTodo(null);
      setTimeout(() => {
        setErrorMessage(Errors.NoErrors);
      }, 3000);
      throw error;
    } finally {
      setLoading(false);
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
      loading,
      setTodos,
      setStatus,
      setErrorMessage,
      setDraftTodo,
      setLoading,
      addTodo,
      deleteTodo,
      handleCompleted,
    }),
    [
      todos,
      status,
      errorMessage,
      loading,
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
