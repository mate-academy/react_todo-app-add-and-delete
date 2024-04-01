import React, { useEffect } from 'react';
import { USER_ID, getTodos } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { UserWarning } from './UserWarning';
import { useTodosContext } from './components/useTodosContext';

export const App: React.FC = () => {
  const { todos, setTodos, handleError, setIsInputFocused } = useTodosContext();

  useEffect(() => {
    setIsInputFocused(true);

    getTodos()
      .then(setTodos)
      .catch(() => handleError('Unable to load todos'));
  }, [setTodos, handleError, setIsInputFocused]);

  return USER_ID ? (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos.length !== 0 && (
          <>
            <TodoList />
            <Footer />
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  ) : (
    <UserWarning />
  );
};
