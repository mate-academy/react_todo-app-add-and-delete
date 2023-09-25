// add the string only for tests and new pr
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { TodosProvider } from './Context';
import USER_ID from './helpers/USER_ID';

// components
import { UserWarning } from './Pages/Auth/UserWarning';
import { Application } from './Pages/Application/Application';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosProvider>
      <Application />
    </TodosProvider>
  );
};
