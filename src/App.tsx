/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useContext } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { StateContext } from './components/TodosContext';

const USER_ID = 56;

export const App: React.FC = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { todos } = useContext(StateContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  if (isError) {
    setTimeout(() => {
      setIsError(false);
    }, 3000);
  }

  const hasTodos = todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          USER_ID={USER_ID}
          setIsError={setIsError}
          setErrorMessage={setErrorMessage}
        />

        <Main />

        {/* Hide the footer if there are no todos */}
        {hasTodos && <Footer />}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {isError && (
        <Error
          isError={isError}
          errorMessage={errorMessage}
          setIsError={setIsError}
        />
      )}
    </div>
  );
};
