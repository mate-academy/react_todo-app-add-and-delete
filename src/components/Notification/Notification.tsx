/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useContext } from 'react';
import { TodosContext } from '../../TodosContext/TodosContext';

export const Notification: React.FC = () => {
  const { errorMessage, setErrorMessage } = useContext(TodosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          'is-active': errorMessage,
          hidden: !errorMessage,
        },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage(null)}
      />
      {/* show only one message at a time */}
      {errorMessage}
    </div>
  );
};
