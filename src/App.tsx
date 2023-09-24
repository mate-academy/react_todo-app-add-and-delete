/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { TodosContext } from './components/TodosContext/TodosContext';

export const App: React.FC = () => {
  const { visibleTodos, todos } = useContext(TodosContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList todos={visibleTodos} />

        {!!todos.length && (
          <Footer />
        )}

        {/* Hide the footer if there are no todos */}

      </div>
      <ErrorNotification />
      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}

    </div>
  );
};
