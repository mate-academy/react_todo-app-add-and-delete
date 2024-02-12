/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import { Header } from './Header';
import { Main } from './Main';
import { Footer } from './Footer';
import { TodoContext } from '../context/TodoContext';
import { ErrorArea } from './ErrorArea';

export const TodoApp: React.FC = () => {
  const { todos, errorMessage, setErrorMessage } = useContext(TodoContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage, setErrorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos && (
          <Main />
        )}

        {!!todos.length && (
          <Footer />
        )}
      </div>

      <ErrorArea />
    </div>
  );
};
