/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { UserWarning } from './UserWarning';
import { TodoContext } from './components/TodosContext';
import { TodoContextProps } from './types/TodoContextProps';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorComponent } from './components/ErrorComponent';
import { USER_ID } from './constants';

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
