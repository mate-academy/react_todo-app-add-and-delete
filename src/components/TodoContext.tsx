import { ErrorText } from '../types/ErrorText';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';
import { TodoContextType } from '../types/TodoContextType';
import * as todosServices from '../api/todos';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const initialTodoContext: TodoContextType = {
  todos: [],
  setTodos: () => {},
  status: Status.All,
  setStatus: () => {},
  errMessage: ErrorText.NoErr,
  setErrMessage: () => {},
  deleteTodo: () => {},
  addTodo: () => {},
  loading: false,
  setLoading: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  handleCompleted: () => {},
};

const TodoContext = React.createContext<TodoContextType>(initialTodoContext);

interface Props {
  children: React.ReactNode;
}

export const TodoContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [errMessage, setErrMessage] = useState(ErrorText.NoErr);
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todosServices
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrMessage(ErrorText.LoadErr);
        setTimeout(() => setErrMessage(ErrorText.NoErr), 3000);
      });
  }, [setErrMessage]);

  const deleteTodo = useCallback(
    async (todoId: number) => {
      setLoading(true);
      setErrMessage(ErrorText.NoErr);
      try {
        await todosServices.deleteTodos(todoId);
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      } catch (error) {
        setErrMessage(ErrorText.DeleteErr);
        setTimeout(() => setErrMessage(ErrorText.NoErr), 3000);
      } finally {
        setLoading(false);
      }
    },
    [setTodos],
  );

  const addTodo = useCallback(
    async ({ title, completed, userId }: Todo) => {
      if (loading) {
        return;
      }

      if (!title.trim()) {
        setErrMessage(ErrorText.EmptyTitleErr);

        return;
      }

      setLoading(true);
      setErrMessage(ErrorText.NoErr);
      setTempTodo({ id: 0, title, userId, completed: false });
      try {
        const newestTodo = await todosServices.createTodos({
          title,
          completed,
          userId,
        });

        setTodos(currentTodos => [...currentTodos, newestTodo]);
        setTempTodo(null);
      } catch (error) {
        setErrMessage(ErrorText.AddErr);
      } finally {
        setLoading(false);
      }
    },
    [loading, setTodos, setLoading, setErrMessage, setTempTodo],
  );

  const handleCompleted = useCallback(
    (currentTodo: Todo) => {
      setTodos(prevTodo =>
        prevTodo.map(todo =>
          todo.id === currentTodo.id
            ? { ...todo, completed: !todo.completed }
            : todo,
        ),
      );
    },
    [setTodos],
  );

  const todosContextValue = useMemo(
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
    }),
    [
      todos,
      status,
      tempTodo,
      deleteTodo,
      errMessage,
      loading,
      addTodo,
      setLoading,
      setErrMessage,
      setTempTodo,
      handleCompleted,
    ],
  );

  return (
    <TodoContext.Provider value={todosContextValue}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
