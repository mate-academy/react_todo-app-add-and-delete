import React, { useState } from 'react';
import classNames from 'classnames';

export const Error: React.FC = () => {
  const [error, setError] = useState(false);

  if (error) {
    setTimeout(() => {
      setError(false);
    }, 2000);
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        id="button"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError(false)}
      >
        .
      </button>

      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo
    </div>
  );
};
