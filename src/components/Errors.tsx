import React from 'react';
import cn from 'classnames';

type Props = {
  error: string;
  setErrors: (error: string) => void;
};

export default function Errors({ error, setErrors }: Props) {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrors('')}
      />
      {/* show only one message at a time */}
      {error}
    </div>
  );
}

/// other errors =
{
  /* <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */
}
