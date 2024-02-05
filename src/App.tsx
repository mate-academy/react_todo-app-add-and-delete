/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { UserWarning } from './UserWarning';
// eslint-disable-next-line import/no-cycle
import { TodoContext } from './components/TodosContext';
import { TodoContextProps } from './types/TodoContextProps';
// eslint-disable-next-line import/no-cycle
import { Header } from './components/Header';
// eslint-disable-next-line import/no-cycle
import { TodoList } from './components/TodoList';
// eslint-disable-next-line import/no-cycle
import { Footer } from './components/Footer';
// eslint-disable-next-line import/no-cycle
import { ErrorComponent } from './components/ErrorComponent';
// eslint-disable-next-line import/no-cycle

export const USER_ID = 94;

export const App: React.FC = () => {
  const {
    todos,
  }:TodoContextProps = useContext(TodoContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos && <TodoList />}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && <Footer />}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorComponent />
    </div>
  );
};
