/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';

import { USER_ID } from './api/todos';
import { UserWarning } from './components/Warning/UserWarning';
import { TodoProvider } from './Context/TodoContext';
import { FilterProvider } from './Context/FilterContext';
import { TodoContent } from './components/TodoContent';

export const App: FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <TodoProvider>
        <FilterProvider>
          <TodoContent />
        </FilterProvider>
      </TodoProvider>
    </div>
  );
};
