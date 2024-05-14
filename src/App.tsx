/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Header } from './Components/Header/Header';
import { TodoList } from './Components/TodoList/TodoList';
import { TodosProvider } from './TodosContext';
import { Footer } from './Components/Footer/Footer';
import { Error } from './Components/Error/Error';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <TodosProvider>
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header />

          <TodoList />

          {/* Hide the footer if there are no todos */}
          <Footer />
        </div>

        {/* DON'T use conditional rendering to hide the notification */}
        {/* Add the 'hidden' class to hide the message smoothly */}

        <Error />
      </TodosProvider>
    </div>
  );
};
