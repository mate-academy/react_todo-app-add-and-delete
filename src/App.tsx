import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import { getTodos, removeTodo } from './api/todos';
import { UserContext } from './UserContext';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer/Footer';

import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterByStatus, setFilterByStatus] = useState(FilterStatus.All);
  const [errorType, setErrorType] = useState(ErrorType.None);
  const [hasError, setHasError] = useState(false);
  const [tempTodoName, setTempTodoName] = useState('');
  const [isClearCompleted, setIsClearCompleted] = useState(false);
  const userId = useContext(UserContext);

  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        const todosFromServer = await getTodos(userId);

        setTodos(todosFromServer);
      } catch (error) {
        setHasError(true);
        setErrorType(ErrorType.Load);
      }
    };

    getTodosFromServer();
  }, []);

  const activeTodosAmount = todos.filter(todo => !todo.completed).length;
  const completedTodosAmount = todos.filter(todo => todo.completed).length;

  const filterTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filterByStatus) {
        case FilterStatus.All:
          return true;

        case FilterStatus.Active:
          return !todo.completed;

        case FilterStatus.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filterByStatus]);

  const showError = useCallback((error: ErrorType) => {
    setErrorType(error);
    setHasError(true);
  }, []);
  const hideError = useCallback(() => {
    setHasError(false);
  }, []);

  const addNewTodo = useCallback(
    (newTodo: Todo): void => setTodos((oldTodos) => [...oldTodos, newTodo]),
    [],
  );

  const deleteTodo = useCallback(
    (todoId: number): void => (
      setTodos((oldTodos) => oldTodos.filter((todo) => todo.id !== todoId))
    ),
    [],
  );

  const onClearCompleted = useCallback(() => {
    const completedTodos = todos.filter((todo) => todo.completed);

    setIsClearCompleted(true);
    hideError();

    Promise.all(
      completedTodos.map((todo) => removeTodo(todo.id).then(() => todo.id)),
    )
      .then((ids) => {
        setTodos((oldTodos) => {
          return oldTodos.filter((todo) => !ids.includes(todo.id));
        });
      })
      .catch(() => {
        showError(ErrorType.Delete);
      })
      .finally(() => {
        setIsClearCompleted(false);
      });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodosAmount={activeTodosAmount}
          showError={showError}
          hideError={hideError}
          showTempTodo={setTempTodoName}
          addNewTodo={addNewTodo}
        />

        <TodoList
          todos={filterTodos}
          tempTodoName={tempTodoName}
          showError={showError}
          hideError={hideError}
          deleteTodo={deleteTodo}
          isClearCompleted={isClearCompleted}

        />

        {todos.length > 0 && (
          <Footer
            activeTodosAmount={activeTodosAmount}
            completedTodosAmount={completedTodosAmount}
            filterByStatus={filterByStatus}
            setFilterByStatus={setFilterByStatus}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorType={errorType}
        hasError={hasError}
        onNotificationClose={hideError}
      />
    </div>
  );
};
