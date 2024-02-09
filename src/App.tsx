/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoContext } from './contexts/TodoContext';
import { Header } from './components/Header';
import { USER_ID } from './constants';
import { Footer } from './components/Footer';
import { Errors } from './components/Errors';

export const App: React.FC = () => {
  const { todos, setTodos, setErrorMessage } = useContext(TodoContext);

  const handleCatch = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => handleCatch());
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        {todos.length > 0 && (
          <Footer />
        )}
      </div>

      <Errors />
    </div>
  );
};
