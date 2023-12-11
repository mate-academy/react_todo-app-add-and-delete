import React, { useContext } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodosContext, USER_ID } from './components/TodosContext/TodosContext';
import { ErrorMessage } from './types/ErrorMessages';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const { todos, isError, handleSetError } = useContext(TodosContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        {todos.length > 0 && (
          <>
            <TodoList />

            <Footer />
          </>
        )}
      </div>

      {isError && (
        <div
          data-cy="ErrorNotification"
          className={cn('notification',
            'is-danger',
            'is-light',
            'has-text-weight-normal', {
              hidden: !isError,
            })}
        >
          <button
            aria-label="hide-error"
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => handleSetError(ErrorMessage.NOT_ERROR)}
          />
          {isError}
        </div>
      )}
    </div>
  );
};
