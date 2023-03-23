/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6397;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentError, setCurrentError] = useState('');
  const [status, setStatus] = useState<Status>(Status.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const visibleTodos = todos.filter(
    todo => {
      switch (status) {
        case Status.ACTIVE:
          return !todo.completed;
        case Status.COMPLETED:
          return todo.completed;
        case Status.ALL:
        default:
          return true;
      }
    },
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed), [todos],
  );

  const getTodosFromServer = async (uri: string) => {
    try {
      setCurrentError('');
      setIsLoading(true);
      const data = await getTodos(uri);

      setTodos(data);
    } catch (error) {
      if (error instanceof Error) {
        setCurrentError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addNewTodo = useCallback(async (title: string) => {
    setCurrentError('');

    const data = {
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      setTempTodo({ ...data, id: 0 });
      setIsLoading(true);

      const responseTodo = await addTodos(`?userId=${USER_ID}`, data);

      setTodos(currentTodos => [...currentTodos, responseTodo]);
    } catch (error) {
      if (error instanceof Error) {
        setCurrentError(error.message);
      }
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const removeTodo = useCallback(async (todo: Todo) => {
    try {
      setCurrentError('');
      setTempTodo(todo);
      setIsLoading(true);
      await deleteTodos(`/${todo.id}?userId=${USER_ID}`);
      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
    } catch (error) {
      if (error instanceof Error) {
        setCurrentError(error.message);
      }
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const removeAllCompletedTodos = useCallback(async () => {
    const currentCompletedTodos = todos.filter(todo => todo.completed);

    await Promise.all(currentCompletedTodos.map(
      currentCompletedTodo => removeTodo(currentCompletedTodo),
    ));
  }, [todos]);

  const updateTodoStatus = useCallback(async (
    isCompleted: boolean,
    todo: Todo,
  ) => {
    try {
      setCurrentError('');
      setTempTodo(todo);
      setIsLoading(true);
      await updateTodos(`/${todo.id}?userId=${USER_ID}`, { completed: isCompleted });
      await getTodosFromServer(`?userId=${USER_ID}`);
    } catch (error) {
      if (error instanceof Error) {
        setCurrentError(error.message);
      }
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const updateAllTodosStatus = useCallback((isCompleted: boolean) => {
    const updatedTodos = todos.filter(todo => todo.completed !== isCompleted);

    updatedTodos.forEach(async activeTodo => {
      await updateTodoStatus(isCompleted, activeTodo);
    });
  }, [todos]);

  const updateTodoTitle = useCallback(async (title: string, todo: Todo) => {
    try {
      setCurrentError('');
      setTempTodo(todo);
      setIsLoading(true);
      await updateTodos(`/${todo.id}?userId=${USER_ID}`, { title });
      setTodos((prevTodos) => prevTodos.map((t) => {
        if (t.id === todo.id) {
          return { ...t, title };
        }

        return t;
      }));
    } catch (error) {
      if (error instanceof Error) {
        setCurrentError(error.message);
      }
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getTodosFromServer(`?userId=${USER_ID}`);
  }, []);

  const removeError = useCallback(() => {
    setCurrentError('');
  }, []);

  const countOfActiveTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  const isAllTodosCompleted = useMemo(() => {
    return todos.length === completedTodos.length && !!todos.length;
  }, [todos, completedTodos.length]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          addNewTodo={addNewTodo}
          updateAllTodosStatus={updateAllTodosStatus}
          isAllTodosCompleted={isAllTodosCompleted}
        />
        {!(todos.length === 0) && (
          <>
            <TodoList
              todos={visibleTodos}
              removeTodo={removeTodo}
              tempTodo={tempTodo}
              isLoading={isLoading}
              completedTodos={completedTodos}
              updateTodoStatus={updateTodoStatus}
              updateTodoTitle={updateTodoTitle}
            />
            <Footer
              onFilterChange={setStatus}
              filter={status}
              countOfActiveTodos={countOfActiveTodos}
              completedTodoLength={completedTodos.length}
              removeAllCompletedTodos={removeAllCompletedTodos}
            />
          </>
        )}
      </div>
      {currentError && (
        <ErrorNotification
          error={currentError}
          removeError={removeError}
        />
      )}
    </div>
  );
};
