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

// enum ErrorMessage {
//   UNABLE_TO_ADD = 'Unable to add a todo',
//   UNABLE_TO_DELETE = 'Unable to delete a todo',
//   UNABLE_TO_UPDATE = 'Unable to update a todo',
// }

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('a');
  const [visibleTodos, setVisibleTodos] = useState<Todo[] | null>(todos);

  useEffect(() => {
    getTodos(USER_ID)
      .then((promise) => {
        setTodos(promise);
        setVisibleTodos(promise);
      })
      .catch(error => setErrorMessage(error));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  setTimeout(() => {
    setErrorMessage('');
  }, 3000);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos && (
          <>
            {visibleTodos && (
              <Section
                todos={visibleTodos}
              />
            )}

            <Footer
              todos={todos}
              setVisibleTodos={setVisibleTodos}
            />
          </>
        )}

      </div>

      {errorMessage && (
        <Error
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
