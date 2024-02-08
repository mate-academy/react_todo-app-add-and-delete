/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoAppFooter } from './components/TodoAppFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { TodosContext } from './providers/TodosProvider';
import { USER_ID } from './utils/constants';
import { Status } from './types/Status';
import { FocusProvider } from './providers/FocusProvider';

export const App: React.FC = () => {
  const { todos } = useContext(TodosContext);
  const [status, setStatus] = useState(Status.All);

  const filteredTodos = todos.filter((todo) => {
    switch (status) {
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
        return todo.completed;
      case Status.All:
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <FocusProvider>
          <TodoAppHeader />

          <TodoList
            todos={filteredTodos}
          />

          {!!todos.length && (
            <TodoAppFooter
              status={status}
              onStatusChange={setStatus}
            />
          )}
        </FocusProvider>

      </div>

      <ErrorNotification />
    </div>
  );
};
