import React, {
  useCallback, useContext, useEffect, useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer/Footer';
import { getTodos } from './api/todos';
import { prepareTodos } from './utils/helpers';
import { ErrorType } from './types/ErrorType';
import { TodoList } from './components/TodoList/TodoList';
import { AppContext } from './components/TodoContext/TodoContext';
import { USER_ID } from './constants/UserId';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Header } from './components/Header/Header';

export const App: React.FC = () => {
  const {
    todos, setTodos, status, setStatus, error, setError,
  }
    = useContext(AppContext);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorType.cantLoadTodos));
  }, [setTodos, setError]);

  const filterTodos = useCallback(() => {
    return prepareTodos({
      todos,
      status,
    });
  }, [todos, status]);

  const todosOnPage = useMemo(() => filterTodos(), [filterTodos]);

  const uncompletedTodosCount = todos.filter((todo) => !todo.completed).length;

  const isSomeTodosCompleted = todos.some((todo) => todo.completed);

  const isEveryTodosCompleted = todosOnPage.every((todo) => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header isEveryTodosCompleted={isEveryTodosCompleted} />

        <TodoList todos={todosOnPage} />

        {todos.length > 0 && (
          <Footer
            uncompletedTodosCount={uncompletedTodosCount}
            status={status}
            setStatus={setStatus}
            isSomeTodosCompleted={isSomeTodosCompleted}
          />
        )}

        {error && todos.length > 0 && <ErrorMessage />}
      </div>
    </div>
  );
};
