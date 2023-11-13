/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Errors } from './components/Errors';
import { TodoContext } from './TodoContext';

export const App: React.FC = () => {
  const { USER_ID } = useContext(TodoContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        <Main />
        <Footer />
      </div>

      <Errors />
    </div>
  );
};
