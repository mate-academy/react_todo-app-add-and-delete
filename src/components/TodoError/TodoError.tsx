import classNames from 'classnames';
import React, { useContext } from 'react';
import { ErrorContext } from '../ErrorContext';

export const TodoError: React.FC = () => {
  const { error, setError } = useContext(ErrorContext);

  return (
    <div
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        {
          hidden: !error,
        },
      )}
    >
      {/* Notification is shown in case of any error */ }
      {/* Add the 'hidden' class to hide the message smoothly */ }
      <button
        aria-label="delete-error-button"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />

      {error}

      {/* Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
    </div>
  );
};
