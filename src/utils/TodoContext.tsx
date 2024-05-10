import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TodoContextType } from '../types/TodoContextTypes';
import { Status } from '../types/Status';
import { ErrText } from '../types/ErrText';
import { Todo } from '../types/Todo';
import * as todoServices from '../api/todos';

const initialTodoContext: TodoContextType = {
  todos: [],
  setTodos: () => {},
  status: Status.All,
  setStatus: () => {},
  errMessage: ErrText.NoErr,
  setErrMessage: () => {},
  deleteTodo: async () => {},
  addTodo: async () => {},
  loading: false,
  setLoading: () => {},
  setTempTodo: () => {},
  tempTodo: null,
  handleCompleted: () => {},
  modifiedTodoId: 0,
};

const TodoContext = React.createContext<TodoContextType>(initialTodoContext);

interface Props {
  children: React.ReactNode;
}

export const TodoContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errMessage, setErrMessage] = useState(ErrText.NoErr);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [modifiedTodoId, setModifiedTodoId] = useState(0);

  useEffect(() => {
    todoServices
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrMessage(ErrText.LoadErr);
        setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
      });
  }, []);

  const deleteTodo = useCallback(
    async (todoId: number) => {
      setLoading(true);
      setModifiedTodoId(todoId);
      setErrMessage(ErrText.NoErr);
      try {
        await todoServices.deleteTodos(todoId);
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setLoading(false);
      } catch {
        setErrMessage(ErrText.DeleteErr);
        setTodos(todos);
        setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
      } finally {
        setLoading(false);
        // setModifiedTodoId(0);
      }
    },
    [todos],
  );

  const addTodo = useCallback(async ({ title, completed, userId }: Todo) => {
    setLoading(true);
    setErrMessage(ErrText.NoErr);
    setTempTodo({ id: 0, title, userId, completed: false });
    try {
      const newestTodo = await todoServices.createTodos({
        title,
        completed,
        userId,
      });

      setTempTodo(null);
      setTodos(currentTodos => [...currentTodos, newestTodo]);
      setLoading(false);
    } catch (error) {
      setErrMessage(ErrText.AddErr);
      setTempTodo(null);
      setTimeout(() => {
        setErrMessage(ErrText.NoErr);
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

  const todoContextValue = useMemo(
    () => ({
      todos,
      setTodos,
      status,
      setStatus,
      errMessage,
      setErrMessage,
      deleteTodo,
      addTodo,
      loading,
      setLoading,
      tempTodo,
      setTempTodo,
      handleCompleted,
      modifiedTodoId,
    }),
    [
      todos,
      status,
      tempTodo,
      deleteTodo,
      addTodo,
      errMessage,
      loading,
      handleCompleted,
      modifiedTodoId,
    ],
  );

  return (
    <TodoContext.Provider value={todoContextValue}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
