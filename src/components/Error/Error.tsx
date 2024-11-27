import classNames from 'classnames';
import React from 'react';

interface Props {
  error: string;
}

export const Error: React.FC<Props> = React.memo(({ error }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: error.length === 0 },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {/* Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      {error}
    </div>
  );
});

Error.displayName = 'Error';
