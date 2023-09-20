/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { TodosProvider } from './Context';
import USER_ID from './helpers/USER_ID';

// components
import { Header } from './Components/Header';
import { UserWarning } from './Components/UI/UserWarning';
import { TodosList } from './Components/TodosList';
import { Footer } from './Components/Footer';
import { ApiError } from './Components/UI/ApiError';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosProvider>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <Header />

        <div className="todoapp__content">
          <TodosList />
          <Footer />
        </div>

        {/* Notification is shown in case of any error */}
        {/* Add the 'hidden' class to hide the message smoothly */}
        <ApiError />
      </div>
    </TodosProvider>
  );
};
