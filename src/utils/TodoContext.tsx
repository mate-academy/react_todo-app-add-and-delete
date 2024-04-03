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
  deleteTodo: () => {},
  addTodo: () => {},
  loading: false,
  setLoading: () => {},
  setTempTodo: () => {},
  tempTodo: null,
  handleCompleted: () => {},
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

  useEffect(() => {
    todoServices
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrMessage(ErrText.LoadErr);
        setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
      });
  }, [setErrMessage]);

  const deleteTodo = useCallback(
    (todoId: number) => {
      setLoading(true);
      setErrMessage(ErrText.NoErr);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      todoServices.deleteTodos(todoId).catch(() => {
        setErrMessage(ErrText.DeleteErr);
        setTodos(todos);
        setTimeout(() => setErrMessage(ErrText.NoErr), 3000);
      });
    },
    [todos],
  );

  const addTodo = ({ title, completed, userId }: Todo) => {
    setLoading(true);
    setErrMessage(ErrText.NoErr);
    setTempTodo({ id: 0, title, userId, completed: false });
    todoServices
      .createTodos({
        title,
        completed,
        userId,
      })
      .then(newestTodo => {
        setTodos(currentTodos => [...currentTodos, newestTodo]);
        setLoading(false);
        setTempTodo(null);
      })
      .catch(() => {
        setErrMessage(ErrText.AddErr);
        setTimeout(() => {
          setErrMessage(ErrText.NoErr);
          setTempTodo(null);
        }, 3000);
      })
      .finally(() => setLoading(false));
  };

  const handleCompleted = (currentTodo: Todo) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === currentTodo.id
          ? { ...todo, completed: !todo.completed }
          : todo,
      ),
    );
  };

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
    }),
    [todos, status, tempTodo, deleteTodo, errMessage, loading],
  );

  return (
    <TodoContext.Provider value={todoContextValue}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
