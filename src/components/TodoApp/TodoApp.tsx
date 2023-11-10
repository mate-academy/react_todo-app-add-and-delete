/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import classNames from 'classnames';
import { UserWarning } from '../../UserWarning';

import { GlobalContext } from '../../providers';
import { TodoForm } from '../TodoForm';
import { TodoList } from '../TodoList';
import { TodoFooter } from '../TodoFooter';
import { Error } from '../../types/Error';

export const TodoApp: React.FC = () => {
  const {
    USER_ID,
    todos,
    tempTodo,
    error,
    setError,
  } = useContext(GlobalContext);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoForm />

        <TodoList />

        {(todos.length > 0 || tempTodo) && (
          <TodoFooter />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: error === Error.Default },
        )}
      >
        <button
          type="button"
          data-cy="HideErrorButton"
          className="delete"
          onClick={() => setError(Error.Default)}
        />

        {error !== Error.Default && (
          <>
            {error}
          </>
        )}
      </div>
    </div>
  );
};
