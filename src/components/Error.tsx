import classNames from 'classnames';
import React from 'react';

type Props = {
  error: string | null;
};

export const Error: React.FC<Props> = ({ error }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        {
          hidden: error === null,
        },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {error}
      {/* show only one message at a time }
        Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo*/}
    </div>
  );
};
