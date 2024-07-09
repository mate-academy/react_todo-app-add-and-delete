import React from 'react';
import cn from 'classnames';

interface Props {
  error: string;
  setError: (errorMessage: string) => void;
}

export const Error: React.FC<Props> = ({ error, setError }) => {
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
        onClick={() => setError('')}
      />
      {/* show only one message at a time */}

      {error}

      {/* Unable to load todos
      <br />
      Title should not be empty
      <br />
      Unable to add a todo
      <br />
      Unable to delete a todo
      <br />
      Unable to update a todo */}
    </div>
  );
};
