/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Section } from './components/Section/Section';
import { Error } from './components/Error/Error';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';

const USER_ID = 11449;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);

  const clearError = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(clearError, [errorMessage]);

  function loadTodos() {
    getTodos(USER_ID)
      .then(response => {
        setTodos(response);
        setVisibleTodos(response);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }

  useEffect(loadTodos, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header todos={todos} />

        {visibleTodos && (
          <Section
            visibleTodos={visibleTodos}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setVisibleTodos={setVisibleTodos}
          />
        )}

      </div>

      <Error
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
